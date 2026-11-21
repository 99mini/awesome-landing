import { motion, useReducedMotion } from "motion/react";
import * as css from "./split-text.css.ts";

interface SplitTextProps {
  text: string;
  /** 글자 간 지연(s) */
  stagger?: number;
  className?: string;
}

export function SplitText({ text, stagger = 0.03, className }: SplitTextProps) {
  const reduce = useReducedMotion();
  // 줄바꿈은 단어 사이에서만 일어나도록 글자를 단어 단위로 묶는다
  const words = text.split(" ");
  let index = 0;

  return (
    <motion.span
      className={className ? `${css.root} ${className}` : css.root}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {words.map((word, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span aria-hidden className={css.word}>
            {[...word].map((char) => {
              const i = index++;
              return (
                <motion.span
                  key={i}
                  className={css.char}
                  variants={{
                    hidden: { opacity: 0, y: reduce ? 0 : "0.6em", filter: "blur(6px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.5,
                        delay: reduce ? 0 : i * stagger,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        </span>
      ))}
    </motion.span>
  );
}
