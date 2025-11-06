import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import axios from 'axios';
import { TrendingUp, TrendingDown, Minus, BarChart3, Activity } from 'lucide-react';

interface ProgressData {
  date: string;
  day: string;
  testsAttempted: number;
  averageScore: number;
  bestScore: number;
  practiceMinutes: number;
}

interface MiniProgressChartProps {
  userID: string;
  chartType?: 'tests' | 'scores';
  days?: number;
}

const MiniProgressChart: React.FC<MiniProgressChartProps> = ({ 
  userID, 
  chartType = 'tests',
  days = 7 
}) => {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userID) return;
    fetchProgressData();
  }, [userID, days]);

  const fetchProgressData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/progress/daily-progress/${userID}?days=${days}`,
        { withCredentials: true }
      );
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = () => {
    if (progressData.length < 2) return 0;
    
    const recentData = progressData.slice(-7);
    const olderData = progressData.slice(0, Math.min(7, progressData.length - 7));
    
    if (olderData.length === 0) return 0;
    
    const dataKey = chartType === 'tests' ? 'testsAttempted' : 'averageScore';
    
    const recentAvg = recentData.reduce((sum, d) => sum + (d[dataKey] || 0), 0) / recentData.length;
    const olderAvg = olderData.reduce((sum, d) => sum + (d[dataKey] || 0), 0) / olderData.length;
    
    return recentAvg - olderAvg;
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0.5) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (trend < -0.5) return <TrendingDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0.5) return 'text-green-400';
    if (trend < -0.5) return 'text-red-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
            <div className="h-24 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const trend = calculateTrend();
  const total = progressData.reduce((sum, d) => 
    sum + (chartType === 'tests' ? d.testsAttempted : d.averageScore), 0
  );
  const average = progressData.length > 0 ? total / progressData.length : 0;

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-indigo-500/50 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
            {chartType === 'tests' ? (
              <>
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                Test Activity
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 text-emerald-400" />
                Score Trend
              </>
            )}
          </CardTitle>
          {getTrendIcon(trend)}
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-white">
            {average.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">
            {chartType === 'tests' ? 'avg/day' : 'avg score'}
          </span>
        </div>
        {trend !== 0 && (
          <p className={`text-xs ${getTrendColor(trend)}`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)} vs previous week
          </p>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <ResponsiveContainer width="100%" height={80}>
          {chartType === 'tests' ? (
            <BarChart data={progressData}>
              <XAxis 
                dataKey="day" 
                hide 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Bar 
                dataKey="testsAttempted" 
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <LineChart data={progressData}>
              <XAxis 
                dataKey="day" 
                hide 
              />
              <YAxis hide domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Line 
                type="monotone" 
                dataKey="averageScore" 
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
        <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
          <span>{progressData[0]?.day || '-'}</span>
          <span className="text-gray-400">Last {days} days</span>
          <span>{progressData[progressData.length - 1]?.day || '-'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniProgressChart;
