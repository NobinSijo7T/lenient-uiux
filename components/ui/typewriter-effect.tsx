"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  stagger,
  useAnimate,
  useInView,
} from "motion/react";
import { useEffect } from "react";

export const TypewriterEffect = ({
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
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(
                    `dark:text-white text-black opacity-0 hidden`,
                    word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
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
  const getWordColor = (className?: string) => {
    if (className?.includes("text-blue-500")) return "#3b82f6";
    if (className?.includes("text-black")) return "#000";
    return "#fff";
  };

  const renderWords = () => {
    return (
      <>
        {words.map((word, idx) => {
          return (
            <span
              key={`word-${idx}`}
              style={{
                color: getWordColor(word.className),
                display: "inline-block",
                marginRight: idx === words.length - 1 ? 0 : "0.28em",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        margin: "24px 0",
        maxWidth: "100%",
      }}
    >
      <motion.div
        style={{
          overflow: "hidden",
          paddingBottom: "8px",
          maxWidth: "100%",
        }}
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontFamily: "var(--font-sans), Arial, sans-serif",
            fontSize: "clamp(32px, 5vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "0",
            whiteSpace: "nowrap",
          }}
        >
          {renderWords()}
        </div>
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,

          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cursorClassName}
        style={{
          alignSelf: "center",
          background: cursorClassName?.includes("blue") ? "#3b82f6" : "#3b82f6",
          borderRadius: "2px",
          display: "block",
          flex: "0 0 auto",
          height: "clamp(34px, 5.4vw, 72px)",
          width: "4px",
        }}
      ></motion.span>
    </div>
  );
};
