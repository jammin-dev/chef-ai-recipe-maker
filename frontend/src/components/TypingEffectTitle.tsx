import { useState, useEffect } from "react";

import { TypoH2 } from "@/components/ui/typography";

interface TypingEffectTitleProps {
  promptExamples: string[];
}

export default function TypingEffectTitle({
  promptExamples,
}: TypingEffectTitleProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentText = promptExamples[index];
    if (!isDeleting && charIndex < currentText.length) {
      // Typing effect
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + currentText[charIndex]);
        setCharIndex(charIndex + 1);
      }, 70);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex > 0) {
      // Deleting effect
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev.slice(0, -1));
        setCharIndex(charIndex - 1);
      }, 10);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && charIndex === currentText.length) {
      // Wait before deleting
      setTimeout(() => setIsDeleting(true), 800);
    } else if (isDeleting && charIndex === 0) {
      // Move to next text
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % promptExamples.length);
    }
  }, [charIndex, isDeleting, index, promptExamples]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="h-16">
      <TypoH2 classname="text-center">
        {displayedText}
        {showCursor && <span className="animate-pulse">|</span>}
      </TypoH2>
    </div>
  );
}
