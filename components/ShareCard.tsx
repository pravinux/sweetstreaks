'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Download, Share, Copy, Home, Target, Trophy, Share2, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface Milestone {
  days: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

interface UserData {
  name: string;
  email: string;
}

interface ShareCardProps {
  milestone?: Milestone;
  currentStreak: number;
  onNavigate: (section: string) => void;
  user?: UserData;
}

export default function ShareCard({ milestone, currentStreak, onNavigate, user }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const defaultMilestone = {
    days: currentStreak,
    title: currentStreak === 1 ? "First Step" : `${currentStreak} Days Strong`,
    description: "Sugar-free journey milestone achieved!",
    emoji: "🌟",
    color: "gradient-emerald"
  };

  const activeMessage = milestone || defaultMilestone;

  const handleDownload = async () => {
    if (!cardRef.current) {
      toast.error('Unable to generate share card. Please try again.');
      return;
    }
    
    setIsDownloading(true);
    
    try {
      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, // Transparent background
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: false,
        foreignObjectRendering: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          // Apply styles to cloned document for better compatibility
          const clonedElement = clonedDoc.querySelector('[data-share-card]') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.margin = '0';
            clonedElement.style.padding = '0';
            clonedElement.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 50%, #a7f3d0 100%)';
            clonedElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';
            clonedElement.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.3)';
          }
        }
      });
      
      // Create download link
      const link = document.createElement('a');
      link.download = `sweetstreaks-${activeMessage.days}-days-${user?.name.replace(/\s+/g, '-').toLowerCase() || 'achievement'}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('🎉 Achievement card downloaded! Share your victory!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download. Try sharing the text instead!');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareText = `🌟 I've been sugar-free for ${activeMessage.days} days with SweetStreaks! ${user ? `- ${user.name.split(' ')[0]}` : ''} #SugarFree #HealthyLifestyle #SweetStreaks`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SweetStreaks Achievement',
          text: shareText,
          url: window.location.origin
        });
        toast.success('Shared successfully!');
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Achievement text copied to clipboard!');
      } catch (error) {
        toast.error('Sharing not supported on this device');
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast.success('SweetStreaks link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const getPersonalizedMessage = () => {
    const firstName = user?.name.split(' ')[0] || 'Champion';
    
    if (activeMessage.days === 1) {
      return `${firstName} just started their sugar-free journey!`;
    } else if (activeMessage.days === 7) {
      return `${firstName} completed their first week sugar-free! 🚀`;
    } else if (activeMessage.days === 30) {
      return `${firstName} achieved 30 days sugar-free! Amazing! 🌟`;
    } else if (activeMessage.days === 100) {
      return `${firstName} reached 100 days! What a legend! 💎`;
    } else if (activeMessage.days >= 365) {
      return `${firstName} has been sugar-free for a whole year! Incredible! 🏆`;
    } else {
      return `${firstName} is ${activeMessage.days} days strong on their sugar-free journey! 💪`;
    }
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
          <h1 className="text-2xl font-bold text-gray-800">Share Your Victory</h1>
          <p className="text-gray-600 mt-1">Celebrate your amazing achievement!</p>
        </motion.div>

        {/* Share Card Preview - Optimized for download */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div
            ref={cardRef}
            data-share-card
            className="rounded-3xl shadow-lg relative overflow-hidden"
            style={{
              width: '320px',
              height: '400px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 50%, #a7f3d0 100%)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
              padding: '32px',
              margin: '0',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div 
                className="absolute top-4 right-4 w-20 h-20 rounded-full"
                style={{ backgroundColor: '#10b981' }}
              ></div>
              <div 
                className="absolute bottom-8 left-4 w-16 h-16 rounded-full"
                style={{ backgroundColor: '#34d399' }}
              ></div>
              <div 
                className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: '#6ee7b7' }}
              ></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-4">
              {/* App Logo */}
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                }}
              >
                <span className="text-2xl">🍃</span>
              </div>
              
              {/* Achievement */}
              <div className="space-y-2">
                <div className="text-5xl mb-1">{activeMessage.emoji}</div>
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: '#047857' }}
                >
                  {activeMessage.days} Day{activeMessage.days !== 1 ? 's' : ''}
                </h2>
                <p 
                  className="font-medium text-lg"
                  style={{ color: '#059669' }}
                >
                  {activeMessage.title}
                </p>
                <p 
                  className="text-sm leading-tight px-2"
                  style={{ color: '#065f46' }}
                >
                  {getPersonalizedMessage()}
                </p>
              </div>
              
              {/* User Attribution */}
              {user && (
                <div 
                  className="rounded-2xl px-4 py-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <p 
                    className="font-semibold"
                    style={{ color: '#047857' }}
                  >
                    {user.name}
                  </p>
                  <p 
                    className="text-xs"
                    style={{ color: '#059669' }}
                  >
                    Sugar-Free Warrior ⚡
                  </p>
                </div>
              )}
              
              {/* App Attribution */}
              <div className="space-y-1">
                <p 
                  className="font-bold text-xl"
                  style={{ color: '#047857' }}
                >
                  SweetStreaks
                </p>
                <p 
                  className="text-xs"
                  style={{ color: '#065f46' }}
                >
                  Track • Challenge • Celebrate
                </p>
              </div>
              
              {/* Date */}
              <p 
                className="text-xs"
                style={{ color: '#10b981' }}
              >
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Share Achievement Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <Button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            {isDownloading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Your Victory Card...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-3">
                <Award className="w-6 h-6" />
                <span>Share Achievement</span>
              </div>
            )}
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleShare}
              variant="outline"
              className="rounded-2xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 py-3"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Text
            </Button>
            
            <Button 
              onClick={handleCopyLink}
              variant="outline"
              className="rounded-2xl border-purple-200 text-purple-700 hover:bg-purple-50 py-3"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </motion.div>

        {/* Achievement Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white shadow-sm rounded-2xl border-gray-100">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-gray-800">
                🎉 Congratulations{user ? `, ${user.name.split(' ')[0]}` : ''}!
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{activeMessage.days}</p>
                  <p className="text-sm text-gray-600">Days Strong</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.floor(activeMessage.days / 7)}
                  </p>
                  <p className="text-sm text-gray-600">Weeks</p>
                </div>
              </div>
              
              <Badge className="bg-emerald-100 text-emerald-700">
                {activeMessage.title}
              </Badge>
              
              <p className="text-sm text-gray-600">
                You're inspiring others with your dedication to a sugar-free lifestyle!
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Motivation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-beige shadow-sm rounded-2xl">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-amber-800">
                🌟 Victory Shared!
              </h3>
              <p className="text-sm text-amber-700">
                Your achievement is truly remarkable! When you share your success, you inspire others to start their own sugar-free journey. Keep being the amazing example you are!
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4">
          <div className="max-w-md mx-auto flex justify-around">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('dashboard')}
              className="flex flex-col items-center space-y-1 text-gray-500"
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('challenges')}
              className="flex flex-col items-center space-y-1 text-gray-500"
            >
              <Target className="w-5 h-5" />
              <span className="text-xs">Challenges</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('milestones')}
              className="flex flex-col items-center space-y-1 text-gray-500"
            >
              <Trophy className="w-5 h-5" />
              <span className="text-xs">Progress</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('share')}
              className="flex flex-col items-center space-y-1 text-emerald-600"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}