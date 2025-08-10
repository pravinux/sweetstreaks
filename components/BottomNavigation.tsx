'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Home, Target, Trophy, BarChart3, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface BottomNavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    icon: Home,
    label: 'Home',
  },
  {
    id: 'challenges',
    icon: Target,
    label: 'Challenges',
  },
  {
    id: 'milestones',
    icon: Trophy,
    label: 'Milestones',
  },
  {
    id: 'analytics',
    icon: BarChart3,
    label: 'Analytics',
  },
  {
    id: 'settings',
    icon: Settings,
    label: 'Profile',
  },
];

export default function BottomNavigation({ currentSection, onNavigate }: BottomNavigationProps) {
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 safe-area-pb z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-md mx-auto flex justify-around">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${
                isActive 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </motion.div>
  );
}