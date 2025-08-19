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

<<<<<<< HEAD
export default useDetectTabSwitch;
=======
export default useDetectTabSwitch;
>>>>>>> 1e061faa48b29d975b4f2c516a5b3184d56ae42e
