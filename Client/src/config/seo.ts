export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  author?: string;
  canonical?: string;
}

export const defaultSEO: SEOData = {
  title: "PrepBuddy - Master Your Placement Preparation",
  description:
    "PrepBuddy is your ultimate placement preparation platform. Practice aptitude tests from 25+ companies, track progress, earn badges, and compete on global leaderboards.",
  keywords:
    "placement preparation, aptitude test, coding practice, interview prep, technical questions, campus placement, job preparation, quiz platform",
  image: "/preview/hero-preview.png",
  url: "https://prep-buddy-test.vercel.app",
  type: "website",
  siteName: "PrepBuddy",
  author: "PrepBuddy Team",
};

export const pageSEOData: Record<string, SEOData> = {
  "/": {
    title: "PrepBuddy - Ultimate Placement Preparation Platform",
    description:
      "Master your placement preparation with PrepBuddy. Practice aptitude tests from 25+ top companies, track your progress, and compete with students worldwide.",
    keywords:
      "placement preparation, aptitude test, campus placement, job interview, coding practice, technical interview",
    type: "website",
  },
  "/homepage": {
    title: "Dashboard - PrepBuddy",
    description:
      "Your personalized PrepBuddy dashboard. Track your progress, view recent tests, check leaderboard rankings, and continue your placement preparation journey.",
    keywords:
      "dashboard, progress tracking, test results, placement preparation, student portal",
    type: "website",
  },
  "/testpage": {
    title: "Company Aptitude Test - PrepBuddy",
    description:
      "Practice company-specific aptitude questions and coding problems. Prepare for placement tests with real company patterns.",
    keywords:
      "aptitude test, company test, placement test, coding interview, technical interview",
    type: "article",
  },
  "/profile": {
    title: "My Profile - PrepBuddy",
    description:
      "View and manage your PrepBuddy profile. Check your progress, earned badges, test history, and performance analytics.",
    keywords:
      "user profile, progress tracking, badges, test history, performance analytics",
    type: "profile",
  },
  "/previous-tests": {
    title: "Test History - PrepBuddy",
    description:
      "Review your previous test attempts, scores, and detailed performance analysis. Track your improvement over time.",
    keywords:
      "test history, previous attempts, score analysis, performance tracking",
    type: "website",
  },
  "/score-board": {
    title: "Global Leaderboard - PrepBuddy",
    description:
      "Check the global leaderboard and see how you rank among PrepBuddy users. Compete with students worldwide and track your progress.",
    keywords:
      "leaderboard, rankings, competition, global scores, student rankings",
    type: "website",
  },
};


