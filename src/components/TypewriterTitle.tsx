'use client';

import { useState, useEffect } from 'react';

interface TypewriterTitleProps {
  text: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  restartPause?: number;
  className?: string;
}

export function TypewriterTitle({ 
  text, 
  typeSpeed = 120, 
  deleteSpeed = 80, 
  pauseDuration = 3000,
  restartPause = 1500,
  className = '' 
}: TypewriterTitleProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isRestarting) {
      timeout = setTimeout(() => {
        setIsRestarting(false);
      }, restartPause);
    } else if (isDeleting) {
      if (currentIndex > 0) {
        timeout = setTimeout(() => {
          setDisplayText(text.substring(0, currentIndex - 1));
          setCurrentIndex(prev => prev - 1);
        }, deleteSpeed);
      } else {
        setIsDeleting(false);
        setIsRestarting(true);
      }
    } else {
      if (currentIndex < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(text.substring(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        }, typeSpeed);
      } else {
        setIsPaused(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, isPaused, isRestarting, text, typeSpeed, deleteSpeed, pauseDuration, restartPause]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <h1 className={`font-black font-mono ${className}`}>
      {displayText}
      <span className={`inline-block w-[0.6em] h-[0.15em] bg-current ml-0.5 align-bottom translate-y-[-0.05em] transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
      </span>
    </h1>
  );
}