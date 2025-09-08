import { useState, useEffect, useRef, useCallback } from 'react';

interface UsePracticeTimerProps {
  duration?: number; // Duration in seconds, default 20 minutes
  onTimeUp?: () => void; // Callback when time expires
  autoStart?: boolean; // Whether to start automatically, default true
}

export const usePracticeTimer = ({ 
  duration = 1200, // 20 minutes default
  onTimeUp,
  autoStart = true 
}: UsePracticeTimerProps = {}) => {
  const [remainingTime, setRemainingTime] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start timer
  const startTimer = useCallback(() => {
    if (!isExpired) {
      setIsRunning(true);
      setStartTime(Date.now());
    }
  }, [isExpired]);

  // Pause timer
  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset timer
  const resetTimer = useCallback(() => {
    setRemainingTime(duration);
    setIsRunning(autoStart);
    setIsExpired(false);
    setStartTime(Date.now());
  }, [duration, autoStart]);

  // Stop timer completely
  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Format time for display (MM:SS)
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Get elapsed time
  const getElapsedTime = useCallback(() => {
    return duration - remainingTime;
  }, [duration, remainingTime]);

  // Get elapsed time formatted
  const getElapsedTimeFormatted = useCallback(() => {
    return formatTime(getElapsedTime());
  }, [formatTime, getElapsedTime]);

  // Effect to handle timer countdown
  useEffect(() => {
    if (isRunning && !isExpired && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setIsExpired(true);
            setIsRunning(false);
            if (onTimeUp) {
              onTimeUp();
            }
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, isExpired, remainingTime, onTimeUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return {
    remainingTime,
    isRunning,
    isExpired,
    startTime,
    formatTime: (seconds?: number) => formatTime(seconds ?? remainingTime),
    getElapsedTime,
    getElapsedTimeFormatted,
    startTimer,
    pauseTimer,
    resetTimer,
    stopTimer
  };
};
