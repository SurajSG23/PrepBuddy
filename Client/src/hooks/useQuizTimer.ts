import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

interface QuizSession {
  _id: string;
  startTime: string;
  duration: number;
  userAnswers: (string | null)[];
  currentQuestion: number;
  isCompleted: boolean;
}

interface TimerSyncResponse {
  serverTime: string;
  remainingSeconds: number;
  isExpired: boolean;
  session: {
    currentQuestion: number;
    userAnswers: (string | null)[];
    isCompleted: boolean;
  };
}

interface UseQuizTimerProps {
  sessionId: string;
  onTimeUp: () => void;
  onSyncError: (error: string) => void;
}

export const useQuizTimer = ({ sessionId, onTimeUp, onSyncError }: UseQuizTimerProps) => {
  const [remainingTime, setRemainingTime] = useState<number>(600); // 10 minutes default
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [serverTimeOffset, setServerTimeOffset] = useState<number>(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync timer with server
  const syncWithServer = useCallback(async () => {
    try {
      const response = await axios.get<TimerSyncResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/quiz/sync/${sessionId}`,
        { withCredentials: true }
      );

      const { remainingSeconds, isExpired: serverExpired, serverTime } = response.data;
      
      setRemainingTime(remainingSeconds);
      setIsExpired(serverExpired);
      setLastSyncTime(new Date());
      
      // Calculate time offset between client and server
      const clientTime = new Date();
      const serverTimeDate = new Date(serverTime);
      setServerTimeOffset(clientTime.getTime() - serverTimeDate.getTime());
      
      if (serverExpired) {
        onTimeUp();
      }
      
      return response.data.session;
    } catch (error) {
      console.error('Error syncing with server:', error);
      onSyncError('Failed to sync timer with server');
      return null;
    }
  }, [sessionId, onTimeUp, onSyncError]);

  // Save progress to server
  const saveProgress = useCallback(async (userAnswers: (string | null)[], currentQuestion: number) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/quiz/save-progress/${sessionId}`,
        {
          userAnswers,
          currentQuestion
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error saving progress:', error);
      // Don't show error to user for auto-save failures
    }
  }, [sessionId]);

  // Start timer
  const startTimer = useCallback(() => {
    // Initial sync
    syncWithServer();
    
    // Set up periodic sync every 30 seconds
    syncIntervalRef.current = setInterval(() => {
      syncWithServer();
    }, 30000);
    
    // Set up local timer that updates every second
    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsExpired(true);
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [syncWithServer, onTimeUp]);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }
  }, []);

  // Start auto-save with dynamic data
  const startAutoSave = useCallback(() => {
    // Clear any existing auto-save interval
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
    }
    
    // Set up auto-save every 10 seconds
    saveIntervalRef.current = setInterval(() => {
      // Auto-save will be triggered by component calling saveCurrentProgress
      // This prevents stale data issues
    }, 10000);
  }, []);

  // Save current progress (to be called from component with current data)
  const saveCurrentProgress = useCallback(async (userAnswers: (string | null)[], currentQuestion: number) => {
    try {
      await saveProgress(userAnswers, currentQuestion);
    } catch (error) {
      console.error('Error saving current progress:', error);
    }
  }, [saveProgress]);

  // Stop auto-save
  const stopAutoSave = useCallback(() => {
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }
  }, []);

  // Format time for display
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopAutoSave();
    };
  }, [stopTimer, stopAutoSave]);

  return {
    remainingTime,
    isExpired,
    lastSyncTime,
    formatTime,
    syncWithServer,
    saveProgress,
    saveCurrentProgress,
    startTimer,
    stopTimer,
    startAutoSave,
    stopAutoSave
  };
};
