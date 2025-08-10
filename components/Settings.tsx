'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, LogOut, Settings as SettingsIcon, Calendar, Trophy, Zap, Share2, Download, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface UserData {
  name: string;
  email: string;
}

interface SettingsProps {
  user: UserData;
  onLogout: () => void;
  onUpdateProfile: (userData: UserData) => void;
  currentStreak: number;
  totalDays: number;
  startDate: Date;
  completedChallenges: number;
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

export default function Settings({ 
  user, 
  onLogout, 
  onUpdateProfile, 
  currentStreak, 
  totalDays, 
  startDate, 
  completedChallenges,
  analytics 
}: SettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    if (!editedUser.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    onUpdateProfile(editedUser);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    setTimeout(() => {
      onLogout();
    }, 1000);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const journeyDays = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const handleShareAchievement = () => {
    // Create shareable image/card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(1, '#059669');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text styling
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = 'bold 64px system-ui';
    ctx.fillText(`${currentStreak} Days`, canvas.width / 2, 200);
    
    ctx.font = 'bold 32px system-ui';
    ctx.fillText('Sugar-Free!', canvas.width / 2, 260);
    
    ctx.font = '24px system-ui';
    ctx.fillText(`${user.name}'s journey with SweetStreaks`, canvas.width / 2, 320);
    
    ctx.font = 'bold 20px system-ui';
    ctx.fillText(`Quality Score: ${analytics.qualityScore}%`, canvas.width / 2, 380);
    ctx.fillText(`Consistency: ${analytics.consistencyPercentage}%`, canvas.width / 2, 410);
    
    ctx.font = '16px system-ui';
    ctx.fillText('🍃 Building healthier habits, one day at a time', canvas.width / 2, 460);
    
    // Download the image
    const link = document.createElement('a');
    link.download = `sweetstreaks-${currentStreak}-days-achievement.png`;
    link.href = canvas.toDataURL();
    link.click();
    
    toast.success('🎉 Achievement card downloaded! Ready to share your success!');
  };

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
          <h1 className="text-2xl font-bold text-gray-800">⚙️ Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account and share achievements</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="space-y-4">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-lg">
                    {getInitials(user.name)}
                  </span>
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editedUser.name}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                        className="font-semibold text-lg border-emerald-200 focus:border-emerald-400"
                        placeholder="Your name"
                      />
                      <Input
                        value={editedUser.email}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                        className="text-gray-600 border-emerald-200 focus:border-emerald-400"
                        placeholder="Your email"
                        type="email"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-semibold text-lg text-gray-800">{user.name}</h2>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSave}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="w-full rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Achievement Sharing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-sm rounded-2xl border-emerald-200">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-800">Share Your Success</h3>
                <p className="text-sm text-emerald-700 mt-1">
                  {currentStreak} days sugar-free and counting! 🎉
                </p>
              </div>
              <Button 
                onClick={handleShareAchievement}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Achievement Card
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <Card className="p-4 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{currentStreak}</p>
              <p className="text-sm text-gray-600">Current Streak</p>
            </div>
          </Card>

          <Card className="p-4 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{analytics.longestStreak}</p>
              <p className="text-sm text-gray-600">Longest Streak</p>
            </div>
          </Card>

          <Card className="p-4 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
                <Star className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{analytics.qualityScore}%</p>
              <p className="text-sm text-gray-600">Quality Score</p>
            </div>
          </Card>

          <Card className="p-4 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{analytics.consistencyPercentage}%</p>
              <p className="text-sm text-gray-600">Consistency</p>
            </div>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">About SweetStreaks</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Version</span>
                  <Badge variant="secondary">2.0.0</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-gray-800">
                    {startDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <Badge className="bg-emerald-100 text-emerald-700">Free</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Check-ins</span>
                  <span className="text-gray-800">{analytics.totalCheckIns}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Journey Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm rounded-2xl border-amber-200">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-amber-800">
                🌟 Your Journey
              </h3>
              <p className="text-sm text-amber-700">
                You've been on your sugar-free journey for {journeyDays} days with a {currentStreak}-day current streak! 
                Your consistency is {analytics.consistencyPercentage}% and you've completed {completedChallenges} challenges. 
                Amazing work, {user.name.split(' ')[0]}! 🎉
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-4 bg-white shadow-sm rounded-2xl border-gray-100">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}