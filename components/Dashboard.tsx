'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, Target, Trophy, Share2, CheckCircle2, User, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import DatePicker from './DatePicker';

interface Challenge {
  id: string;
  title: string;
  currentDay: number;
  duration: number;
  emoji: string;
  color: string;
  lastCheckIn?: Date;
}

interface UserData {
  name: string;
  email: string;
}

interface StreakStatus {
  status: 'active' | 'warning' | 'critical' | 'broken';
  hoursRemaining: number;
  canUseShield: boolean;
  nextNotification: 'reminder' | 'warning' | 'critical' | 'recovery' | null;
}

interface StreakAnalytics {
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
}

interface DashboardProps {
  startDate: Date;
  currentStreak: number;
  onCheckIn: () => void;
  hasCheckedInToday: boolean;
  onDateChange?: (date: Date) => void;
  activeChallenges?: Challenge[];
  onChallengeCheckIn?: (challengeId: string) => void;
  user?: UserData;
  streakStatus?: StreakStatus;
  analytics?: StreakAnalytics;
}

export default function Dashboard({ 
  startDate, 
  currentStreak, 
  onCheckIn, 
  hasCheckedInToday,
  onDateChange,
  activeChallenges = [],
  onChallengeCheckIn,
  user,
  streakStatus,
  analytics
}: DashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pastel color mapping for challenges
  const challengeColors = {
    'no-soda': { bg: 'bg-sky', text: 'text-sky-dark', gradient: 'gradient-sky' },
    'no-fast-food': { bg: 'bg-peach', text: 'text-peach-dark', gradient: 'gradient-peach' },
    'no-sugar-drinks': { bg: 'bg-lavender', text: 'text-lavender-dark', gradient: 'gradient-lavender' },
    'home-cooked': { bg: 'bg-sage', text: 'text-sage-dark', gradient: 'gradient-sage' },
    'no-processed': { bg: 'bg-blush', text: 'text-blush-dark', gradient: 'gradient-blush' },
    'no-maida': { bg: 'bg-cream', text: 'text-cream-dark', gradient: 'gradient-cream' },
  };

  const milestones = [1, 3, 7, 14, 30, 50, 100, 365];
  const nextMilestone = milestones.find(m => m > currentStreak);
  const previousMilestone = milestones.filter(m => m <= currentStreak).pop() || 0;
  
  const getMilestoneTitle = (days: number) => {
    if (days === 1) return "First Step";
    if (days === 3) return "3 Days";
    if (days === 7) return "Week Warrior";
    if (days === 14) return "2 Weeks";
    if (days === 30) return "Monthly Master";
    if (days === 50) return "50 Days";
    if (days === 100) return "Century Star";
    if (days === 365) return "Yearly Legend";
    return `${days} Days`;
  };

  const getPersonalizedGreeting = () => {
    const firstName = user?.name.split(' ')[0] || 'there';
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) timeGreeting = 'Good morning';
    else if (hour < 17) timeGreeting = 'Good afternoon';
    else timeGreeting = 'Good evening';

    if (currentStreak === 0) return `${timeGreeting}, ${firstName}! Ready to start your sugar-free journey?`;
    if (currentStreak === 1) return `Great start, ${firstName}!`;
    if (currentStreak < 7) return `Building momentum, ${firstName}!`;
    if (currentStreak < 30) return `You're on fire, ${firstName}!`;
    return `Amazing dedication, ${firstName}!`;
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.name.split(' ')[0] || '';
    
    if (hour < 12) return `Good morning${firstName ? `, ${firstName}` : ''}!`;
    else if (hour < 17) return `Good afternoon${firstName ? `, ${firstName}` : ''}!`;
    else return `Good evening${firstName ? `, ${firstName}` : ''}!`;
  };

  const getStreakStatusColor = () => {
    if (!streakStatus) return 'text-emerald-600';
    switch (streakStatus.status) {
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'broken': return 'text-gray-500';
      default: return 'text-emerald-600';
    }
  };

  const getStreakStatusMessage = () => {
    if (!streakStatus) return '';
    switch (streakStatus.status) {
      case 'warning':
        return `⚠️ ${Math.floor(streakStatus.hoursRemaining)}h ${Math.floor((streakStatus.hoursRemaining % 1) * 60)}m remaining`;
      case 'critical':
        return `🚨 Critical: ${Math.floor(streakStatus.hoursRemaining)}h ${Math.floor((streakStatus.hoursRemaining % 1) * 60)}m left!`;
      case 'broken':
        return streakStatus.canUseShield ? '🛡️ Use Streak Shield to recover' : '💔 Streak broken - start fresh!';
      default:
        return '';
    }
  };

  // Check if challenge can be checked in (within 24 hours)
  const canCheckInChallenge = (challenge: Challenge) => {
    if (!challenge.lastCheckIn) return true;
    const today = new Date();
    const lastCheckIn = new Date(challenge.lastCheckIn);
    return (
      today.getFullYear() !== lastCheckIn.getFullYear() ||
      today.getMonth() !== lastCheckIn.getMonth() ||
      today.getDate() !== lastCheckIn.getDate()
    );
  };

  const milestoneProgress = nextMilestone 
    ? ((currentStreak - previousMilestone) / (nextMilestone - previousMilestone)) * 100
    : 100;

  // Circular progress calculation
  const circumference = 2 * Math.PI * 45; // radius = 45
  const progressOffset = circumference - (milestoneProgress / 100) * circumference;

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-mint-50 p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-white/50 rounded-2xl"></div>
          <div className="h-48 bg-white/50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <motion.div 
        className="max-w-md mx-auto space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">🍃</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">SweetStreaks</h1>
              <p className="text-sm text-gray-600">{getTimeBasedGreeting()}</p>
            </div>
          </div>
          <div className="p-1 rounded-full transition-colors">
            {user ? (
              <div className="w-10 h-10 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white shadow-md transition-all duration-200 hover:scale-105">
                <span className="text-white text-sm font-semibold">
                  {getInitials(user.name)}
                </span>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center border-2 border-white shadow-md transition-all duration-200 hover:scale-105">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Progress Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 bg-white shadow-sm rounded-3xl border-gray-100">
            <div className="text-center space-y-6">
              {/* Circular Progress */}
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-800">{currentStreak}</span>
                  <span className="text-sm text-gray-500">
                    {currentStreak === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
              
              {/* Status */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">{getPersonalizedGreeting()}</h2>
                
                {/* Streak Status Warning */}
                {streakStatus && streakStatus.status !== 'active' && (
                  <div className={`text-sm font-medium ${getStreakStatusColor()}`}>
                    {getStreakStatusMessage()}
                  </div>
                )}
                
                <p className="text-gray-600">
                  You've been sugar-free since
                </p>
                <p className="text-emerald-600 font-medium">
                  {startDate.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </p>
                
                <Button 
                  variant="ghost"
                  onClick={() => setShowDatePicker(true)}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 text-sm mt-2"
                >
                  Change Start Date
                </Button>

                {/* Quality Score */}
                {analytics && (
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm text-gray-600">Quality:</span>
                    <span className={`text-sm font-semibold ${
                      analytics.qualityScore >= 90 ? 'text-emerald-600' : 
                      analytics.qualityScore >= 80 ? 'text-yellow-600' : 'text-orange-600'
                    }`}>
                      {analytics.qualityScore}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Today's Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {hasCheckedInToday ? (
            <Card className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-3xl shadow-sm">
              <div className="text-center space-y-3">
                <motion.div 
                  className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Well done{user ? `, ${user.name.split(' ')[0]}` : ''}! 🎉
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    You've already checked in today
                  </p>
                </div>
                <div className="bg-emerald-600/50 rounded-2xl p-3 mt-4">
                  <p className="text-sm">
                    ✅ Checked in on {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 bg-white rounded-3xl shadow-sm border-gray-100">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Today's Check-in{user ? `, ${user.name.split(' ')[0]}` : ''}
                </h3>
                <p className="text-gray-600">
                  How are you feeling today? Ready to stay strong?
                </p>
                <Button 
                  onClick={onCheckIn}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl py-3"
                >
                  ✅ Yes! I stayed sugar-free today
                </Button>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Next Milestone */}
        {nextMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 bg-white rounded-2xl shadow-sm border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium text-gray-800">Next Milestone</span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  🏆 {nextMilestone - currentStreak} Days
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm text-gray-600">
                    {currentStreak}/{nextMilestone} days
                  </span>
                </div>
                <Progress 
                  value={(currentStreak / nextMilestone) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-gray-500">
                  {nextMilestone - currentStreak} more days until your {getMilestoneTitle(nextMilestone)} milestone! 🎉
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Active Challenges</h3>
              <span className="text-purple-600 text-sm font-medium">
                View All in Challenges Tab
              </span>
            </div>
            
            {activeChallenges.map((challenge) => {
              const colorScheme = challengeColors[challenge.id as keyof typeof challengeColors] || 
                { bg: 'bg-mint-light', text: 'text-emerald-600', gradient: 'gradient-mint' };
              
              return (
                <Card key={challenge.id} className="p-4 bg-white rounded-2xl shadow-sm border-gray-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-full ${colorScheme.bg} flex items-center justify-center`}>
                      <span className="text-lg">{challenge.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                      <p className="text-sm text-gray-600">
                        Day {challenge.currentDay} of {challenge.duration}
                      </p>
                    </div>
                    <span className={`text-sm font-medium ${colorScheme.text}`}>
                      {challenge.duration - challenge.currentDay} days left
                    </span>
                  </div>
                  
                  {canCheckInChallenge(challenge) ? (
                    <Button 
                      onClick={() => onChallengeCheckIn?.(challenge.id)}
                      className={`w-full ${colorScheme.gradient} text-white hover:scale-105 transition-transform rounded-xl py-2`}
                      size="sm"
                    >
                      🎯 Day {challenge.currentDay + 1} – Crushing it, {user?.name.split(' ')[0] || 'champion'}!
                    </Button>
                  ) : (
                    <div className="w-full bg-gray-100 text-gray-500 rounded-xl py-2 text-center text-sm">
                      ✅ Checked in for today!
                    </div>
                  )}
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Coming Soon - Nutrition Database */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-beige rounded-2xl border-amber-100">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-200 rounded-full">
                <span className="text-xl">🗄️</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-800">Coming Soon</h3>
                <p className="text-sm text-amber-700">
                  Nutrition database with 1M+ foods to track sugar content
                </p>
              </div>
              <Button 
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Learn More
              </Button>
            </div>
          </Card>
        </motion.div>


      </motion.div>

      {/* Date Picker Modal */}
      {showDatePicker && onDateChange && (
        <DatePicker
          currentDate={startDate}
          onDateChange={onDateChange}
          onClose={() => setShowDatePicker(false)}
        />
      )}
    </div>
  );
}