
"use client";

import { cn } from "../../../lib/utils";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { useEffect, useState } from "react";

const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const [isDone, setIsDone] = useState(false); 

  useEffect(() => {
    if (isInView) {
      const totalChars = wordsArray.reduce((acc, word) => acc + word.text.length, 0);
      const delayPerChar = 0.1;
      const totalDuration = totalChars * delayPerChar * 1000 + 300;

      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(delayPerChar),
          ease: "easeInOut",
        }
      );

     
      const timeout = setTimeout(() => {
        setIsDone(true);
      }, totalDuration);

      return () => clearTimeout(timeout);
    }
  }, [isInView]);

  const renderWords = () => (
    <motion.div ref={scope} className="inline">
      {wordsArray.map((word, idx) => (
        <div key={`word-${idx}`} className="inline-block">
          {word.text.map((char, index) => (
            <motion.span
              initial={{}}
              key={`char-${index}`}
              className={cn(
                `dark:text-indigo-500 text-black opacity-0 hidden`,
                word.className
              )}
            >
              {char}
            </motion.span>
          ))}
          &nbsp;
        </div>
      ))}
    </motion.div>
  );

  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      {!isDone && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className={cn(
            "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
            cursorClassName
          )}
        />
      )}
    </div>
  );
};

export default TypewriterEffect;
