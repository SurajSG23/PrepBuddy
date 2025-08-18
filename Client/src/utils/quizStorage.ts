interface QuizProgress {
  sessionId: string;
  userAnswers: (string | null)[];
  currentQuestion: number;
  lastSaved: number;
  topic: string;
  title: string;
}

const QUIZ_PROGRESS_KEY = 'quiz_progress';
const QUIZ_SESSION_KEY = 'quiz_session';

export const quizStorage = {
  // Save progress to localStorage
  saveProgress: (progress: QuizProgress): void => {
    try {
      localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Load progress from localStorage
  loadProgress: (): QuizProgress | null => {
    try {
      const stored = localStorage.getItem(QUIZ_PROGRESS_KEY);
      if (stored) {
        const progress = JSON.parse(stored);
        // Check if progress is less than 24 hours old
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        if (now - progress.lastSaved < oneDay) {
          return progress;
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  },

  // Clear progress from localStorage
  clearProgress: (): void => {
    try {
      localStorage.removeItem(QUIZ_PROGRESS_KEY);
      localStorage.removeItem(QUIZ_SESSION_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Save session data
  saveSession: (sessionData: any): void => {
    try {
      localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error saving session to localStorage:', error);
    }
  },

  // Load session data
  loadSession: (): any => {
    try {
      const stored = localStorage.getItem(QUIZ_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading session from localStorage:', error);
      return null;
    }
  },

  // Check if there's an active quiz session
  hasActiveSession: (): boolean => {
    const progress = quizStorage.loadProgress();
    const session = quizStorage.loadSession();
    return !!(progress && session);
  },

  // Get session age in minutes
  getSessionAge: (): number => {
    const progress = quizStorage.loadProgress();
    if (!progress) return 0;
    
    const now = Date.now();
    return Math.floor((now - progress.lastSaved) / (60 * 1000));
  }
};
