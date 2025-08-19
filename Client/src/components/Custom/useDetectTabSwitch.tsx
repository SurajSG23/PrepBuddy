import { useEffect } from "react";

const useDetectTabSwitch = () => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("Warning! Switching tabs during the test is not allowed.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
};

export default useDetectTabSwitch;