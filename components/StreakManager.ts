interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  startDate: Date;
  totalCheckIns: number;
  streakShields: StreakShield[];
  streakHistory: StreakEntry[];
  qualityScore: number;
  consistencyPercentage: number;
}

interface StreakShield {
  id: string;
  usedAt: Date;
  recoveredDay: Date;
  cooldownUntil: Date;
}

interface StreakEntry {
  date: Date;
  checkInTime: Date;
  status: 'perfect' | 'grace' | 'shield' | 'missed';
  qualityScore: number;
}

interface StreakStatus {
  status: 'active' | 'warning' | 'critical' | 'broken';
  hoursRemaining: number;
  canUseShield: boolean;
  nextNotification: 'reminder' | 'warning' | 'critical' | 'recovery' | null;
}

export class StreakManager {
  private static readonly CHECK_IN_WINDOW_HOURS = 24;
  private static readonly GRACE_PERIOD_HOURS = 2;
  private static readonly TOTAL_WINDOW_HOURS = 26;
  private static readonly MAX_SHIELDS_PER_MONTH = 3;
  private static readonly SHIELD_COOLDOWN_DAYS = 7;
  private static readonly SHIELD_USAGE_WINDOW_HOURS = 48;

  static getStreakStatus(streakData: StreakData): StreakStatus {
    if (!streakData.lastCheckIn) {
      return {
        status: 'active',
        hoursRemaining: this.CHECK_IN_WINDOW_HOURS,
        canUseShield: false,
        nextNotification: 'reminder'
      };
    }

    const now = new Date();
    const lastCheckInUTC = new Date(streakData.lastCheckIn.getTime());
    const hoursElapsed = (now.getTime() - lastCheckInUTC.getTime()) / (1000 * 60 * 60);
    const hoursRemaining = this.TOTAL_WINDOW_HOURS - hoursElapsed;

    let status: 'active' | 'warning' | 'critical' | 'broken';
    let nextNotification: 'reminder' | 'warning' | 'critical' | 'recovery' | null = null;

    if (hoursElapsed < this.CHECK_IN_WINDOW_HOURS) {
      status = 'active';
      if (hoursElapsed >= 20) nextNotification = 'reminder';
    } else if (hoursElapsed < this.TOTAL_WINDOW_HOURS) {
      status = hoursElapsed < 25 ? 'warning' : 'critical';
      if (hoursElapsed >= 23 && hoursElapsed < 25) nextNotification = 'warning';
      else if (hoursElapsed >= 25) nextNotification = 'critical';
    } else {
      status = 'broken';
      nextNotification = 'recovery';
    }

    const canUseShield = this.canUseStreakShield(streakData, now);

    return {
      status,
      hoursRemaining: Math.max(0, hoursRemaining),
      canUseShield: canUseShield && (status === 'critical' || status === 'broken'),
      nextNotification
    };
  }

  static checkIn(streakData: StreakData, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): StreakData {
    const now = new Date();
    const today = this.getLocalDate(now, timezone);
    
    // Prevent duplicate check-ins on the same day
    if (this.hasCheckedInToday(streakData, timezone)) {
      throw new Error('Already checked in today');
    }

    // Validate timestamp authenticity (basic check)
    if (!this.isValidTimestamp(now)) {
      throw new Error('Invalid timestamp detected');
    }

    const status = this.getStreakStatus(streakData);
    let qualityScore: number;
    let streakStatus: 'perfect' | 'grace' | 'shield' | 'missed';

    if (status.hoursRemaining >= 2) {
      // Perfect check-in
      qualityScore = 100;
      streakStatus = 'perfect';
    } else if (status.hoursRemaining > 0) {
      // Grace period check-in
      qualityScore = 90;
      streakStatus = 'grace';
    } else {
      // Would break streak
      throw new Error('Check-in window expired');
    }

    // Calculate new streak
    const newStreak = status.status === 'broken' ? 1 : streakData.currentStreak + 1;
    const newLongestStreak = Math.max(streakData.longestStreak, newStreak);

    // Add to history
    const newEntry: StreakEntry = {
      date: today,
      checkInTime: now,
      status: streakStatus,
      qualityScore
    };

    const updatedHistory = [...streakData.streakHistory, newEntry];
    const newQualityScore = this.calculateQualityScore(updatedHistory);
    const newConsistencyPercentage = this.calculateConsistencyPercentage(streakData.startDate, updatedHistory);

    return {
      ...streakData,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastCheckIn: now,
      totalCheckIns: streakData.totalCheckIns + 1,
      streakHistory: updatedHistory,
      qualityScore: newQualityScore,
      consistencyPercentage: newConsistencyPercentage
    };
  }

  static useStreakShield(streakData: StreakData, missedDate: Date): StreakData {
    const now = new Date();
    
    if (!this.canUseStreakShield(streakData, now)) {
      throw new Error('Cannot use streak shield at this time');
    }

    // Check if within usage window
    const hoursElapsed = (now.getTime() - missedDate.getTime()) / (1000 * 60 * 60);
    if (hoursElapsed > this.SHIELD_USAGE_WINDOW_HOURS) {
      throw new Error('Shield usage window expired');
    }

    const newShield: StreakShield = {
      id: `shield_${Date.now()}`,
      usedAt: now,
      recoveredDay: missedDate,
      cooldownUntil: new Date(now.getTime() + (this.SHIELD_COOLDOWN_DAYS * 24 * 60 * 60 * 1000))
    };

    // Add shield entry to history
    const shieldEntry: StreakEntry = {
      date: missedDate,
      checkInTime: now,
      status: 'shield',
      qualityScore: 80
    };

    const updatedHistory = [...streakData.streakHistory, shieldEntry];
    const newQualityScore = this.calculateQualityScore(updatedHistory);
    const newConsistencyPercentage = this.calculateConsistencyPercentage(streakData.startDate, updatedHistory);

    return {
      ...streakData,
      streakShields: [...streakData.streakShields, newShield],
      streakHistory: updatedHistory,
      qualityScore: newQualityScore,
      consistencyPercentage: newConsistencyPercentage,
      totalCheckIns: streakData.totalCheckIns + 1
    };
  }

  static hasCheckedInToday(streakData: StreakData, timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone): boolean {
    if (!streakData.lastCheckIn) return false;
    
    const today = this.getLocalDate(new Date(), timezone);
    const lastCheckInDate = this.getLocalDate(streakData.lastCheckIn, timezone);
    
    return today.getTime() === lastCheckInDate.getTime();
  }

  static canUseStreakShield(streakData: StreakData, currentTime: Date): boolean {
    // Check monthly limit
    const currentMonth = currentTime.getMonth();
    const currentYear = currentTime.getFullYear();
    const shieldsThisMonth = streakData.streakShields.filter(shield => {
      const shieldDate = new Date(shield.usedAt);
      return shieldDate.getMonth() === currentMonth && shieldDate.getFullYear() === currentYear;
    }).length;

    if (shieldsThisMonth >= this.MAX_SHIELDS_PER_MONTH) {
      return false;
    }

    // Check cooldown
    const lastShield = streakData.streakShields
      .sort((a, b) => b.usedAt.getTime() - a.usedAt.getTime())[0];
    
    if (lastShield && currentTime < lastShield.cooldownUntil) {
      return false;
    }

    return true;
  }

  static getShieldsRemaining(streakData: StreakData, currentTime: Date): number {
    const currentMonth = currentTime.getMonth();
    const currentYear = currentTime.getFullYear();
    const shieldsThisMonth = streakData.streakShields.filter(shield => {
      const shieldDate = new Date(shield.usedAt);
      return shieldDate.getMonth() === currentMonth && shieldDate.getFullYear() === currentYear;
    }).length;

    return Math.max(0, this.MAX_SHIELDS_PER_MONTH - shieldsThisMonth);
  }

  static calculateRetroactiveStreak(startDate: Date, firstCheckIn: Date): number {
    if (startDate >= firstCheckIn) return 0;
    
    const timeDiff = firstCheckIn.getTime() - startDate.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  }

  static calculateQualityScore(history: StreakEntry[]): number {
    if (history.length === 0) return 100;
    
    const totalScore = history.reduce((sum, entry) => sum + entry.qualityScore, 0);
    return Math.round(totalScore / history.length);
  }

  static calculateConsistencyPercentage(startDate: Date, history: StreakEntry[]): number {
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (daysSinceStart === 0) return 100;
    
    return Math.round((history.length / daysSinceStart) * 100);
  }

  static getLocalDate(date: Date, timezone: string): Date {
    const utcDate = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
    const targetTime = new Date(utcDate.toLocaleString("en-US", { timeZone: timezone }));
    return new Date(targetTime.getFullYear(), targetTime.getMonth(), targetTime.getDate());
  }

  static isValidTimestamp(timestamp: Date): boolean {
    const now = new Date();
    const maxFuture = new Date(now.getTime() + (5 * 60 * 1000)); // 5 minutes future tolerance
    const maxPast = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)); // 7 days past tolerance
    
    return timestamp >= maxPast && timestamp <= maxFuture;
  }

  static getNextNotificationTime(streakData: StreakData): Date | null {
    if (!streakData.lastCheckIn) return null;
    
    const status = this.getStreakStatus(streakData);
    const lastCheckin = new Date(streakData.lastCheckIn);
    
    switch (status.nextNotification) {
      case 'reminder':
        return new Date(lastCheckin.getTime() + (20 * 60 * 60 * 1000));
      case 'warning':
        return new Date(lastCheckin.getTime() + (23 * 60 * 60 * 1000));
      case 'critical':
        return new Date(lastCheckin.getTime() + (25 * 60 * 60 * 1000));
      default:
        return null;
    }
  }

  static getStreakAnalytics(streakData: StreakData): {
    currentStreak: number;
    longestStreak: number;
    totalCheckIns: number;
    consistencyPercentage: number;
    qualityScore: number;
    perfectDays: number;
    graceDays: number;
    shieldDays: number;
    shieldsRemaining: number;
    monthlyPerformance: { month: string; checkIns: number; quality: number }[];
  } {
    const now = new Date();
    const perfectDays = streakData.streakHistory.filter(entry => entry.status === 'perfect').length;
    const graceDays = streakData.streakHistory.filter(entry => entry.status === 'grace').length;
    const shieldDays = streakData.streakHistory.filter(entry => entry.status === 'shield').length;
    const shieldsRemaining = this.getShieldsRemaining(streakData, now);
    
    // Calculate monthly performance for last 6 months
    const monthlyPerformance = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEntries = streakData.streakHistory.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.getMonth() === targetDate.getMonth() && 
               entryDate.getFullYear() === targetDate.getFullYear();
      });
      
      const quality = monthEntries.length > 0 
        ? Math.round(monthEntries.reduce((sum, entry) => sum + entry.qualityScore, 0) / monthEntries.length)
        : 0;
      
      monthlyPerformance.push({
        month: targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        checkIns: monthEntries.length,
        quality
      });
    }
    
    return {
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      totalCheckIns: streakData.totalCheckIns,
      consistencyPercentage: streakData.consistencyPercentage,
      qualityScore: streakData.qualityScore,
      perfectDays,
      graceDays,
      shieldDays,
      shieldsRemaining,
      monthlyPerformance
    };
  }
}

export type { StreakData, StreakShield, StreakEntry, StreakStatus };