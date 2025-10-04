import { useCallback, useEffect, useRef, useState } from "react";

export interface UsePracticeTimerProps {
  duration?: number; // seconds
  autoStart?: boolean;
  onTimeUp?: () => void;
}

export const usePracticeTimer = ({
  duration = 1800,
  autoStart = false,
  onTimeUp,
}: UsePracticeTimerProps) => {
  const [remainingTime, setRemainingTime] = useState<number>(duration);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (isExpired) return;
    if (timerRef.current !== null) return; // already running
    setIsRunning(true);
    timerRef.current = window.setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          setIsExpired(true);
          try {
            onTimeUp && onTimeUp();
          } catch (e) {
            // swallow handler errors
            // eslint-disable-next-line no-console
            console.error("onTimeUp handler error", e);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;
  }, [clearTimer, isExpired, onTimeUp]);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const resetTimer = useCallback((newDuration?: number) => {
    clearTimer();
    const d = typeof newDuration === "number" ? newDuration : duration;
    setRemainingTime(d);
    setIsExpired(false);
    setIsRunning(false);
  }, [clearTimer, duration]);

  const formatTime = useCallback(() => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, [remainingTime]);

  useEffect(() => {
    if (autoStart) {
      startTimer();
    }
    return () => {
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    remainingTime,
    isRunning,
    isExpired,
    formatTime,
    startTimer,
    pauseTimer,
    resetTimer,
  };
};
