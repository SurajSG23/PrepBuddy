// src/components/Custom/faqData.ts

interface FaqItem {
  keywords: string[];
  answer: string;
  followUp?: string; // Optional follow-up for more engaging conversation
}

const faqData: FaqItem[] = [
  // --- Onboarding & Basic Navigation for New Users ---
  {
    keywords: ["help", "navigate", "walkthrough", "how to use", "start", "get started", "first time", "new user"],
    answer: "Welcome to PrepBuddy! A great place to start is by trying a test for a company you're interested in from the 'Popular Company Tests' tab on the homepage. It's a fun way to see how the tests work. Don't worry about the score on your first try!",
    followUp: "What would you like to do first?"
  },
  {
    keywords: ["what is this", "about prepbuddy", "purpose of this app", "tell me about app"],
    answer: "PrepBuddy is an AI-powered platform designed to help you prepare for technical and aptitude interviews. It uses Google's Gemini AI to generate unique practice tests to get you ready for the real thing."
  },
  {
    keywords: ["profile", "my account", "view profile", "change name", "update profile picture"],
    answer: "You can access your profile by clicking your name in the top-right corner and selecting 'My Profile'. There you can see your stats, badges, and recent test history. You can also click the edit icons to change your name and avatar."
  },
  {
    keywords: ["notes", "download notes", "study material"],
    answer: "Yes, there is a 'Notes' section available in the user menu. It contains downloadable PDF notes for various computer science subjects to help you study for your tests."
  },

  // --- Test Taking & Strategy ---
  {
    keywords: ["scoring", "points", "rank", "ranking"],
    answer: "You get 1 point for each correct answer in a test. Your total points determine your rank on the Leaderboard. The more tests you take and the higher you score, the higher you'll climb!",
    followUp: "You can view the current rankings on the 'Leader Board' page."
  },
  {
    keywords: ["which test", "what test should i take", "recommend a test"],
    answer: "It depends on your goals! If you're targeting a specific company, start with their test on the homepage. If you want to improve a weak area, try a 'Technical Questions' practice session. Or, you can just ask me to 'suggest a test' for a personalized recommendation!"
  },
  {
    keywords: ["how to improve", "get better score", "study tips", "prepare"],
    answer: "Consistency is key! Try to take at least one test a day. After each test, review your mistakes in the 'Previous Tests' section. Use the AI's explanations to understand why an answer was correct and study related topics in the 'Notes' section. Don't worry about low scores at first, focus on learning!",
  },
  {
    keywords: ["custom test", "create test"],
    answer: "On the homepage, click the 'Create Custom Test' tab. You can then enter a company name, a specific topic (like 'JavaScript' or 'Data Structures'), and choose a difficulty level to generate a personalized test."
  },
  {
    keywords: ["technical questions", "practice topic"],
    answer: "Yes! On the homepage, select the 'Choose Your Focus Area' tab, then click on 'Technical Questions'. This will take you to a page where you can practice specific subjects like Operating Systems, DBMS, and more."
  },
  {
    keywords: ["test history", "previous tests", "past results"],
    answer: "You can see all your past test results by selecting 'Previous Tests' from the user menu in the header. It shows your score and the date for each test you've completed."
  },
  {
    keywords: ["is there a penalty", "negative marking"],
    answer: "No, there is no negative marking or penalty for wrong answers. So, it's always a good idea to make an educated guess if you're unsure!",
  },
  {
    keywords: ["difficulty", "easy", "medium", "hard"],
    answer: "The difficulty level (Easy, Medium, Hard) affects the complexity of the questions the AI generates. If you're new, starting with 'Medium' is a good baseline. As you get more confident, challenge yourself with 'Hard' tests!"
  },

  // --- Features & Misc ---
  {
    keywords: ["badge", "badges", "achievement", "achievements"],
    answer: "You can earn badges for special achievements, like completing 10 tests or getting a perfect score on a difficult test. You can view all your earned badges on your Profile page."
  },
  {
    keywords: ["favorites", "favorite", "save company"],
    answer: "You can click the star icon (☆) next to any company on the homepage to add it to your favorites. You can view all your favorite companies for quick access on the 'Favorites' page, accessible from the user menu."
  },
  {
    keywords: ["leaderboard", "scoreboard"],
    answer: "The 'Leader Board', accessible from the user menu, shows the top-ranked users on the platform based on their total accumulated points. See if you can make it to the top!"
  },
  {
    keywords: ["question of the day", "qotd"],
    answer: "The 'Question of the Day' is a quick, single-question challenge that appears in the header next to your profile. It's a great way to warm up your brain and learn a new concept each day!"
  },
  {
    keywords: ["ai", "gemini", "how questions generated"],
    answer: "This app uses Google's Gemini AI to generate questions, options, and explanations in real-time based on the test parameters you select, ensuring a unique and challenging experience every time."
  },
  
  // --- Troubleshooting & Support ---
  {
    keywords: ["test not loading", "questions not generating", "stuck"],
    answer: "Sometimes the AI needs a moment to generate the questions. If it seems stuck, you can click the 'here' link at the bottom of the test page to regenerate them. If that doesn't work, try starting a new test from the homepage."
  },
  {
    keywords: ["is it free", "cost"],
    answer: "Yes, PrepBuddy is completely free to use! It's a portfolio project designed to help you practice and prepare for your interviews."
  },
  {
    keywords: ["contact", "support", "issue", "bug"],
    answer: "This is a portfolio project created by Suraj. For any inquiries, you can connect with him via the social media links provided in the footer of the page."
  },
  {
    keywords: ["who made you", "developer", "creator"],
    answer: "I was integrated into this project by Suraj! You can find his social links in the footer."
  }
];

export const getResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase().trim();
  
  // Find the best match based on keyword presence
  const found = faqData.find(item =>
    item.keywords.some(keyword => lowerInput.includes(keyword))
  );

  if (found) {
    return found.followUp ? `${found.answer} ${found.followUp}` : found.answer;
  }

  return "I'm not sure how to answer that. You can ask me about scoring, badges, custom tests, or ask me to 'suggest a test'.";
};
