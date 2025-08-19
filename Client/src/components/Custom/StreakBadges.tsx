import React, { useEffect, useState } from 'react';
import { useThemeSelector } from "../../store/hooks";
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
  const darkMode = useThemeSelector((state) => state.theme.darkMode);

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
      <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-200"}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className={darkMode ? "h-4 bg-gray-700 rounded w-1/2 mb-4" : "h-4 bg-indigo-100 rounded w-1/2 mb-4"}></div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={darkMode ? "h-16 bg-gray-700 rounded" : "h-16 bg-indigo-100 rounded"}></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-indigo-200"}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
          <Award className="h-5 w-5" />
          Streak Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {badgeDefinitions.map((badge) => {
            const key = badge.id as keyof UserStreakBadges;
            const isEarned = badges?.[key] || false;
            const IconComponent = badge.icon;
            return (
              <div
                key={badge.id}
                className={`relative bg-gradient-to-br ${badge.color} rounded-lg p-4 text-center transition-all hover:scale-105 ${!isEarned ? 'opacity-50' : ''}`}
              >
                {!isEarned && (
                  <div className={`absolute inset-0 rounded-lg flex items-center justify-center ${darkMode ? "bg-black bg-opacity-60" : "bg-white bg-opacity-60"}`}>
                    <Lock className={darkMode ? "h-6 w-6 text-gray-400" : "h-6 w-6 text-gray-500"} />
                  </div>
                )}
                <IconComponent className={`h-8 w-8 mx-auto mb-2 ${badge.textColor}`} />
                <h4 className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{badge.name}</h4>
                <p className={`text-xs opacity-90 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{badge.description}</p>
                {!isEarned && (
                  <div className="mt-2">
                    <div className={darkMode ? "w-full bg-gray-700 rounded-full h-1.5" : "w-full bg-indigo-100 rounded-full h-1.5"}>
                      <div 
                        className={`bg-gradient-to-r ${badge.color} h-1.5 rounded-full transition-all duration-300`}
                        style={{ width: `${getProgress(badge.requirement)}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs mt-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
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
          <div className={darkMode ? "bg-gray-700/50 rounded-lg p-4" : "bg-indigo-100 rounded-lg p-4"}>
            <h4 className={`text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Next Goal</h4>
            <div className="flex items-center gap-3">
              <nextBadge.icon className={`h-6 w-6 ${nextBadge.textColor}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{nextBadge.name}</p>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{nextBadge.description}</p>
                <div className={darkMode ? "mt-1 w-full bg-gray-600 rounded-full h-2" : "mt-1 w-full bg-indigo-200 rounded-full h-2"}>
                  <div 
                    className={`bg-gradient-to-r ${nextBadge.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${getProgress(nextBadge.requirement)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{currentStreak}</p>
                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>/{nextBadge.requirement}</p>
              </div>
            </div>
          </div>
        )}
        {/* Completion Message */}
        {!nextBadge && badges && Object.values(badges).every(earned => earned) && (
          <div className={darkMode ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-4 text-center" : "bg-gradient-to-r from-indigo-100/70 to-pink-100/70 border border-indigo-200/30 rounded-lg p-4 text-center"}>
            <Crown className={`h-8 w-8 mx-auto mb-2 ${darkMode ? "text-purple-400" : "text-purple-700"}`} />
            <p className={darkMode ? "text-purple-400 font-semibold" : "text-purple-700 font-semibold"}>Legend Status Achieved!</p>
            <p className={darkMode ? "text-sm text-gray-300" : "text-sm text-gray-700"}>You've earned all streak badges!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakBadges;


