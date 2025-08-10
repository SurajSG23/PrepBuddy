import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import axios from 'axios';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface ProgressData {
  date: string;
  day: string;
  testsAttempted: number;
  averageScore: number;
  bestScore: number;
}

interface MiniProgressChartProps {
  userID: string;
  type?: 'tests' | 'scores';
}

const MiniProgressChart: React.FC<MiniProgressChartProps> = ({ userID, type = 'tests' }) => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userID) return;
    fetchProgressData();
  }, [userID]);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/progress/daily-progress/${userID}?days=7`,
        { withCredentials: true }
      );
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-20 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalTests = progressData.reduce((sum, data) => sum + data.testsAttempted, 0);
  const avgScore = progressData.length > 0 
    ? progressData.reduce((sum, data) => sum + data.averageScore, 0) / progressData.filter(d => d.averageScore > 0).length || 0
    : 0;

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#10b981'; // green
    if (score >= 6) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getTrendDirection = () => {
    if (progressData.length < 2) return 'neutral';
    const recent = progressData.slice(-3);
    const older = progressData.slice(0, -3);
    
    const recentAvg = recent.length > 0 
      ? recent.reduce((sum, d) => sum + (type === 'tests' ? d.testsAttempted : d.averageScore), 0) / recent.length 
      : 0;
    const olderAvg = older.length > 0 
      ? older.reduce((sum, d) => sum + (type === 'tests' ? d.testsAttempted : d.averageScore), 0) / older.length 
      : 0;
    
    if (recentAvg > olderAvg * 1.1) return 'up';
    if (recentAvg < olderAvg * 0.9) return 'down';
    return 'neutral';
  };

  const trend = getTrendDirection();
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400';
  const trendIcon = trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→';

  return (
    <Card className="bg-gray-800 border-gray-700 hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          {type === 'tests' ? (
            <>
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              Weekly Activity
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Score Trend
            </>
          )}
        </CardTitle>
        <CardDescription className="text-gray-400 text-sm">
          {type === 'tests' ? 'Tests attempted this week' : 'Your average performance'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-2xl font-bold text-white">
              {type === 'tests' ? totalTests : avgScore.toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">
              {type === 'tests' ? 'total tests' : 'avg score'}
            </p>
          </div>
          <div className={`text-right ${trendColor}`}>
            <p className="text-lg font-semibold">{trendIcon}</p>
            <p className="text-xs">
              {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
            </p>
          </div>
        </div>
        
        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={progressData}>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                labelFormatter={(label) => `Day: ${label}`}
                formatter={(value, name) => [
                  value, 
                  type === 'tests' ? 'Tests' : 'Score'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey={type === 'tests' ? 'testsAttempted' : 'averageScore'}
                stroke={type === 'tests' ? '#6366f1' : getScoreColor(avgScore)}
                strokeWidth={2}
                dot={{ r: 3, fill: type === 'tests' ? '#6366f1' : getScoreColor(avgScore) }}
                activeDot={{ r: 4, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {type === 'tests' && totalTests === 0 && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-500">Take your first test to see progress!</p>
          </div>
        )}
        
        {type === 'scores' && avgScore === 0 && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-500">No scores recorded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MiniProgressChart;

