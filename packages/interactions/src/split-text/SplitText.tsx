import { motion, useReducedMotion } from "motion/react";

interface SplitTextProps {
  text: string;
  /** 글자 간 지연(s) */
  stagger?: number;
  className?: string;
}

export function SplitText({ text, stagger = 0.03, className }: SplitTextProps) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: reduce ? 0 : stagger }}
      style={{ display: "inline-block" }}
    >
      {[...text].map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "pre" }}
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : "0.6em", filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
