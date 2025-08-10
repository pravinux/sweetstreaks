'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Clock, AlertTriangle, Sparkles, X, Check } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { toast } from 'sonner';

interface StreakShieldProps {
  shieldsRemaining: number;
  canUseShield: boolean;
  hoursUntilExpiry: number;
  streakDays: number;
  onUseShield: () => void;
  onClose: () => void;
  isVisible: boolean;
}

export default function StreakShield({
  shieldsRemaining,
  canUseShield,
  hoursUntilExpiry,
  streakDays,
  onUseShield,
  onClose,
  isVisible
}: StreakShieldProps) {
  const [isUsing, setIsUsing] = useState(false);

  const handleUseShield = async () => {
    if (!canUseShield) return;
    
    setIsUsing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate shield activation
      onUseShield();
      toast.success('🛡️ Streak Shield activated! Your streak is safe!', {
        duration: 4000,
      });
    } catch (error) {
      toast.error('Failed to activate Streak Shield. Please try again.');
    } finally {
      setIsUsing(false);
    }
  };

  const getUrgencyColor = () => {
    if (hoursUntilExpiry <= 1) return 'text-red-600';
    if (hoursUntilExpiry <= 6) return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getProgressColor = () => {
    if (hoursUntilExpiry <= 1) return 'bg-red-500';
    if (hoursUntilExpiry <= 6) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Shield Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl border-2 border-emerald-200">
              {/* Header */}
              <div className="relative p-6 pb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-4 right-4 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                      canUseShield ? 'bg-emerald-100' : 'bg-gray-100'
                    }`}
                  >
                    <Shield className={`w-8 h-8 ${
                      canUseShield ? 'text-emerald-600' : 'text-gray-400'
                    }`} />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Streak Shield
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Protect your {streakDays}-day streak
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6 space-y-4">
                {/* Time Remaining */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className={`w-4 h-4 ${getUrgencyColor()}`} />
                      <span className="font-medium text-gray-700">Time Remaining</span>
                    </div>
                    <span className={`font-bold ${getUrgencyColor()}`}>
                      {hoursUntilExpiry > 0 ? `${Math.floor(hoursUntilExpiry)}h ${Math.floor((hoursUntilExpiry % 1) * 60)}m` : 'Expired'}
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.max(0, (hoursUntilExpiry / 48) * 100)} 
                    className="h-2"
                  />
                  
                  {hoursUntilExpiry <= 1 && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">Critical: Shield expires soon!</span>
                    </div>
                  )}
                </div>

                {/* Shield Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{shieldsRemaining}</div>
                    <div className="text-xs text-emerald-700">Shields Left</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-purple-600">{streakDays}</div>
                    <div className="text-xs text-purple-700">Day Streak</div>
                  </div>
                </div>

                {/* How it Works */}
                <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">How Streak Shield Works</span>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-1 ml-6">
                    <li>• Saves your streak when you miss a day</li>
                    <li>• Quality score becomes 80% for shielded days</li>
                    <li>• 7-day cooldown between uses</li>
                    <li>• Maximum 3 shields per month</li>
                  </ul>
                </div>

                {/* Warning Messages */}
                {!canUseShield && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 text-amber-800">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Shield Unavailable</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      {shieldsRemaining === 0 
                        ? "You've used all shields this month. Resets next month."
                        : "Shield is on cooldown. Wait 7 days between uses."
                      }
                    </p>
                  </div>
                )}

                {/* Usage Window Warning */}
                {hoursUntilExpiry <= 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 text-red-800">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Shield Window Expired</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Shields can only be used within 48 hours of a missed check-in.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 rounded-xl border-gray-200 text-gray-700"
                  >
                    Maybe Later
                  </Button>
                  
                  <Button
                    onClick={handleUseShield}
                    disabled={!canUseShield || isUsing || hoursUntilExpiry <= 0}
                    className={`flex-1 rounded-xl text-white ${
                      canUseShield && hoursUntilExpiry > 0
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isUsing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Activating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Use Shield</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}