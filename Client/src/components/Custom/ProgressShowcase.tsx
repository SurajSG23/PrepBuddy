import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import StreakWidget from './StreakWidget';
import MiniProgressChart from './MiniProgressChart';
import ProgressDashboard from './ProgressDashboard';
import StreakBadges from './StreakBadges';
import { Code, Sparkles, Award, BarChart3 } from 'lucide-react';

interface ProgressShowcaseProps {
  userID?: string;
}

const ProgressShowcase: React.FC<ProgressShowcaseProps> = ({ userID = 'demo-user-123' }) => {
  const [currentStreak] = useState(15); // Demo value

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-yellow-400" />
          <h1 className="text-4xl font-bold text-white">Progress Tracking Feature</h1>
          <Sparkles className="h-8 w-8 text-yellow-400" />
        </div>
        <p className="text-gray-400 text-lg">
          New components added to PrepBuddy's Progress Tracking System
        </p>
        <div className="mt-4 inline-block bg-indigo-600/20 border border-indigo-500/30 rounded-lg px-6 py-3">
          <p className="text-indigo-400 font-medium">
            🎯 Feature Status: <span className="text-green-400">~95% Complete</span>
          </p>
        </div>
      </div>

      {/* What's New Section */}
      <Card className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30 mb-8">
        <CardHeader>
          <CardTitle className="text-2xl text-indigo-300 flex items-center gap-2">
            <Code className="h-6 w-6" />
            What's New in This Contribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-400 mb-2">✅ Newly Created</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• <code className="text-indigo-400">StreakWidget.tsx</code> - Compact streak display</li>
                <li>• <code className="text-indigo-400">MiniProgressChart.tsx</code> - Small chart widgets</li>
                <li>• <code className="text-indigo-400">ProgressShowcase.tsx</code> - This demo page</li>
              </ul>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">🔧 Modified</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• <code className="text-indigo-400">HomePage.tsx</code> - Integrated new widgets</li>
              </ul>
              <h3 className="text-lg font-semibold text-purple-400 mb-2 mt-3">📦 Already Existed</h3>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• <code className="text-gray-400">ProgressDashboard.tsx</code></li>
                <li>• <code className="text-gray-400">StreakBadges.tsx</code></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Showcase Sections */}
      
      {/* Section 1: StreakWidget */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-6 w-6 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">1. StreakWidget Component</h2>
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">NEW</span>
        </div>
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-indigo-400">Features</CardTitle>
            <CardDescription>
              Compact widget for displaying user streak information on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-gray-300 space-y-2 text-sm mb-4">
              <li>✨ Dynamic gradient backgrounds based on streak level (6 levels)</li>
              <li>🔥 Current streak with motivational messages</li>
              <li>📅 Today's test count and best streak badges</li>
              <li>🎨 Responsive design with loading skeleton</li>
              <li>🔌 API: <code className="bg-gray-900 px-2 py-1 rounded text-indigo-400">/progress/streak/:id</code></li>
            </ul>
          </CardContent>
        </Card>
        <div className="max-w-md">
          <StreakWidget userID={userID || 'demo-user'} />
        </div>
      </div>

      {/* Section 2: MiniProgressChart */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-6 w-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">2. MiniProgressChart Component</h2>
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">NEW</span>
        </div>
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-indigo-400">Features</CardTitle>
            <CardDescription>
              Small chart widgets for quick progress overview on homepage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-gray-300 space-y-2 text-sm mb-4">
              <li>📊 Two chart types: Tests (bar) and Scores (line)</li>
              <li>📈 Trend indicators (up/down/stable) with weekly comparison</li>
              <li>⏰ Configurable time periods (7 or 30 days)</li>
              <li>💡 Average calculation and display</li>
              <li>🔌 API: <code className="bg-gray-900 px-2 py-1 rounded text-indigo-400">/progress/daily-progress/:id?days=N</code></li>
            </ul>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <MiniProgressChart userID={userID || 'demo-user'} chartType="tests" days={7} />
          <MiniProgressChart userID={userID || 'demo-user'} chartType="scores" days={7} />
        </div>
      </div>

      {/* Section 3: HomePage Integration */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Code className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">3. HomePage Integration</h2>
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">MODIFIED</span>
        </div>
        <Card className="bg-gray-800 border-gray-700 mb-4">
          <CardHeader>
            <CardTitle className="text-indigo-400">Implementation</CardTitle>
            <CardDescription>
              New widgets added to the main HomePage after the welcome message
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>🏠 Location: Between welcome header and tab selector</li>
              <li>📱 Responsive grid: 1/3 (Streak) + 2/3 (Charts) on desktop</li>
              <li>👤 Only visible when user is logged in (checks userID)</li>
              <li>🎯 Shows both test activity and score trends side by side</li>
            </ul>
          </CardContent>
        </Card>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-3">Live preview from HomePage:</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <StreakWidget userID={userID || 'demo-user'} />
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MiniProgressChart userID={userID || 'demo-user'} chartType="tests" days={7} />
              <MiniProgressChart userID={userID || 'demo-user'} chartType="scores" days={7} />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Existing Components (For Comparison) */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Award className="h-6 w-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">4. Existing Components (Already Implemented)</h2>
          <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">EXISTING</span>
        </div>
        
        {/* ProgressDashboard */}
        <div className="mb-8">
          <Card className="bg-gray-800 border-gray-700 mb-4">
            <CardHeader>
              <CardTitle className="text-purple-400">ProgressDashboard.tsx</CardTitle>
              <CardDescription>
                Full-featured dashboard with comprehensive charts and statistics
              </CardDescription>
            </CardHeader>
          </Card>
          <ProgressDashboard userID={userID || 'demo-user'} viewMode="7" />
        </div>

        {/* StreakBadges */}
        <div className="mb-8">
          <Card className="bg-gray-800 border-gray-700 mb-4">
            <CardHeader>
              <CardTitle className="text-purple-400">StreakBadges.tsx</CardTitle>
              <CardDescription>
                Achievement system with 5 progressive badges based on streak milestones
              </CardDescription>
            </CardHeader>
          </Card>
          <StreakBadges userID={userID || 'demo-user'} currentStreak={currentStreak} />
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-2xl text-green-400">✅ Contribution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">2</div>
              <div className="text-gray-300">New Components</div>
              <div className="text-xs text-gray-400 mt-1">StreakWidget + MiniProgressChart</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">1</div>
              <div className="text-gray-300">Modified File</div>
              <div className="text-xs text-gray-400 mt-1">HomePage.tsx integration</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">2</div>
              <div className="text-gray-300">API Endpoints Used</div>
              <div className="text-xs text-gray-400 mt-1">/streak & /daily-progress</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-300 text-sm">
              <strong className="text-white">Next Steps:</strong> Fix critical bug in 
              <code className="bg-gray-900 px-2 py-1 rounded text-red-400 mx-1">testRouter.js</code>
              (line 43: undefined todaysLog variable)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressShowcase;
