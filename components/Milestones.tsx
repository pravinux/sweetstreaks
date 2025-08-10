'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Star, 
  Crown, 
  Gem, 
  Medal, 
  Award, 
  Home,
  Target,
  BarChart3,
  Share2,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface Milestone {
  id: string;
  days: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  achieved: boolean;
  achievedDate?: Date;
}

interface MilestonesProps {
  currentStreak: number;
  longestStreak: number;
  analytics: {
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
  };
}

export default function Milestones({ 
  currentStreak, 
  longestStreak, 
  analytics 
}: MilestonesProps) {
  const milestones: Milestone[] = [
    {
      id: '1day',
      days: 1,
      title: 'First Step',
      description: 'Your journey begins with a single day!',
      icon: <Star className="w-6 h-6" />,
      color: 'from-yellow-400 to-yellow-600',
      achieved: currentStreak >= 1,
    },
    {
      id: '3days',
      days: 3,
      title: 'Momentum Builder',
      description: 'Three days strong - you\'re building habits!',
      icon: <Medal className="w-6 h-6" />,
      color: 'from-orange-400 to-orange-600',
      achieved: currentStreak >= 3,
    },
    {
      id: '1week',
      days: 7,
      title: 'Week Warrior',
      description: 'A full week! You\'re officially on fire!',
      icon: <Award className="w-6 h-6" />,
      color: 'from-emerald-400 to-emerald-600',
      achieved: currentStreak >= 7,
    },
    {
      id: '2weeks',
      days: 14,
      title: 'Fortnight Fighter',
      description: 'Two weeks down - unstoppable momentum!',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-600',
      achieved: currentStreak >= 14,
    },
    {
      id: '1month',
      days: 30,
      title: 'Monthly Master',
      description: 'One month sugar-free! What a champion!',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-400 to-purple-600',
      achieved: currentStreak >= 30,
    },
    {
      id: '50days',
      days: 50,
      title: 'Halfway Hero',
      description: '50 days! You\'re halfway to 100!',
      icon: <Gem className="w-6 h-6" />,
      color: 'from-pink-400 to-pink-600',
      achieved: currentStreak >= 50,
    },
    {
      id: '100days',
      days: 100,
      title: 'Century Star',
      description: '100 days! You\'re absolutely incredible!',
      icon: <Trophy className="w-6 h-6" />,
      color: 'from-amber-400 to-amber-600',
      achieved: currentStreak >= 100,
    },
    {
      id: '365days',
      days: 365,
      title: 'Yearly Legend',
      description: 'A full year! You\'re a true legend!',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-indigo-400 to-indigo-600',
      achieved: currentStreak >= 365,
    },
  ];

  const achievedCount = milestones.filter(m => m.achieved).length;
  const nextMilestone = milestones.find(m => !m.achieved);
  const totalMilestones = milestones.length;
  const progressPercentage = (achievedCount / totalMilestones) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <motion.div 
        className="max-w-md mx-auto space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center py-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-gray-800">🏆 Milestones</h1>
          <p className="text-gray-600 mt-1">Celebrate your amazing achievements!</p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-sm rounded-2xl border-emerald-200">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-emerald-800">
                  {achievedCount} / {totalMilestones}
                </h2>
                <p className="text-emerald-600 font-medium">Milestones Unlocked</p>
              </div>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress 
                  value={progressPercentage} 
                  className="h-3"
                />
                <p className="text-sm text-emerald-700">
                  {Math.round(progressPercentage)}% Complete
                </p>
              </div>
              
              {nextMilestone && (
                <div className="mt-4 p-4 bg-white/80 rounded-xl border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-800">Next Milestone</p>
                  </div>
                  <p className="font-semibold text-emerald-700">
                    {nextMilestone.title}
                  </p>
                  <p className="text-sm text-emerald-600">
                    {nextMilestone.days - currentStreak} more days to go!
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="p-4 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{analytics.qualityScore}%</p>
              <p className="text-sm text-gray-600">Quality Score</p>
            </div>
          </Card>
          
          <Card className="p-4 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{analytics.consistencyPercentage}%</p>
              <p className="text-sm text-gray-600">Consistency</p>
            </div>
          </Card>
        </motion.div>

        {/* Milestones Grid */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Your Journey</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('analytics')}
              className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              View Analytics
            </Button>
          </div>

          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className={milestone.achieved ? "animate-scale-in" : ""}
            >
              <Card className={`p-4 shadow-sm rounded-xl border transition-all duration-300 ${
                milestone.achieved 
                  ? 'bg-white border-emerald-200 hover:shadow-md hover:scale-[1.02]' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                    milestone.achieved 
                      ? `bg-gradient-to-br ${milestone.color} text-white` 
                      : 'bg-gray-300 text-gray-500'
                  }`}>
                    {milestone.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-semibold ${
                        milestone.achieved ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {milestone.title}
                      </h4>
                      {milestone.achieved && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          ✨ Unlocked
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${
                      milestone.achieved ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {milestone.description}
                    </p>
                    <p className={`text-xs mt-1 font-medium ${
                      milestone.achieved ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      {milestone.days} {milestone.days === 1 ? 'day' : 'days'}
                    </p>
                  </div>
                  
                  {milestone.achieved && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onShare(milestone)}
                      className="bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Encouragement */}
        {achievedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm rounded-2xl border-amber-200">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-amber-800">
                  🎉 You're Amazing!
                </h3>
                <p className="text-sm text-amber-700">
                  Every milestone represents your incredible commitment to a healthier lifestyle. 
                  {nextMilestone ? ` Your next milestone is just ${nextMilestone.days - currentStreak} days away!` : ' You\'ve unlocked them all - what a legend!'}
                </p>
              </div>
            </Card>
          </motion.div>
        )}


      </motion.div>
    </div>
  );
}