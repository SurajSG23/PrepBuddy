import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import axios from 'axios';
import { Award, Lock, Star, Crown, Trophy, Zap } from 'lucide-react';

interface UserStreakBadges {
  firstStreak: boolean;
  weekWarrior: boolean;
  twoWeekChamp: boolean;
  monthMaster: boolean;
  streakLegend: boolean;
}

interface StreakBadgesProps {
  userID: string;
  currentStreak: number;
}

const StreakBadges: React.FC<StreakBadgesProps> = ({ userID, currentStreak }) => {
  const [badges, setBadges] = useState<UserStreakBadges | null>(null);
  const [loading, setLoading] = useState(true);

  const badgeDefinitions = [
    {
      id: 'firstStreak',
      name: 'First Steps',
      description: 'Complete your first day streak',
      requirement: 1,
      icon: Star,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-400'
    },
    {
      id: 'weekWarrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      requirement: 7,
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-400'
    },
    {
      id: 'twoWeekChamp',
      name: 'Two Week Champion',
      description: 'Achieve a 14-day streak',
      requirement: 14,
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      textColor: 'text-yellow-400'
    },
    {
      id: 'monthMaster',
      name: 'Month Master',
      description: 'Reach a 30-day streak',
      requirement: 30,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-400'
    },
    {
      id: 'streakLegend',
      name: 'Streak Legend',
      description: 'Achieve a 100-day streak',
      requirement: 100,
      icon: Crown,
      color: 'from-pink-500 to-purple-600',
      textColor: 'text-pink-400'
    }
  ];

  useEffect(() => {
    if (!userID) return;
    fetchUserBadges();
  }, [userID]);

  const fetchUserBadges = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/register/getuser2/${userID}`,
        { withCredentials: true }
      );
      setBadges(response.data.streakBadges || {
        firstStreak: false,
        weekWarrior: false,
        twoWeekChamp: false,
        monthMaster: false,
        streakLegend: false
      });
    } catch (error) {
      console.error('Error fetching user badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (requirement: number) => {
    const progress = Math.min((currentStreak / requirement) * 100, 100);
    return progress;
  };

  const getNextBadge = () => {
    if (!badges) return null;
    
    for (const badge of badgeDefinitions) {
      const key = badge.id as keyof UserStreakBadges;
      if (!badges[key] && currentStreak < badge.requirement) {
        return badge;
      }
    }
    return null;
  };

  const nextBadge = getNextBadge();

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-yellow-400 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Streak Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {badgeDefinitions.map((badge) => {
            const key = badge.id as keyof UserStreakBadges;
            const isEarned = badges?.[key] || false;
            const isClose = currentStreak >= badge.requirement * 0.8; // Within 80% of requirement
            const IconComponent = badge.icon;
            
            return (
              <div
                key={badge.id}
                className={`relative bg-gradient-to-br ${badge.color} rounded-lg p-4 text-center transition-all hover:scale-105 ${
                  !isEarned ? 'opacity-50' : ''
                }`}
              >
                {!isEarned && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                
                <IconComponent className={`h-8 w-8 mx-auto mb-2 ${badge.textColor}`} />
                <h4 className="font-semibold text-white text-sm">{badge.name}</h4>
                <p className="text-xs text-gray-200 opacity-90">{badge.description}</p>
                
                {!isEarned && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div 
                        className={`bg-gradient-to-r ${badge.color} h-1.5 rounded-full transition-all duration-300`}
                        style={{ width: `${getProgress(badge.requirement)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-300 mt-1">
                      {currentStreak}/{badge.requirement} days
                    </p>
                  </div>
                )}
                
                {isEarned && (
                  <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                    <Star className="h-3 w-3 text-white fill-current" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Next Badge Goal */}
        {nextBadge && (
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Next Goal</h4>
            <div className="flex items-center gap-3">
              <nextBadge.icon className={`h-6 w-6 ${nextBadge.textColor}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{nextBadge.name}</p>
                <p className="text-xs text-gray-400">{nextBadge.description}</p>
                <div className="mt-1 w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${nextBadge.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${getProgress(nextBadge.requirement)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{currentStreak}</p>
                <p className="text-xs text-gray-400">/{nextBadge.requirement}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Completion Message */}
        {!nextBadge && badges && Object.values(badges).every(earned => earned) && (
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4 text-center">
            <Crown className="h-8 w-8 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-400 font-semibold">Legend Status Achieved!</p>
            <p className="text-sm text-gray-300">You've earned all streak badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakBadges;


