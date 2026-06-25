import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ThreeBackground from '@/components/ThreeBackground';
import { useLenisContext } from '@/context/LenisContext';

const subtitleWords = ['Graphic Designer', 'Video Editor', 'WordPress Developer'];

export default function Hero() {
  const lenisRef = useLenisContext();
  const [wordIndex, setWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedChars, setDisplayedChars] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const currentWord = subtitleWords[wordIndex];

    if (isTyping) {
      if (displayedChars < currentWord.length) {
        intervalRef.current = setInterval(() => {
          setDisplayedChars((prev) => prev + 1);
        }, 50);
      } else {
        intervalRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 2000) as unknown as ReturnType<typeof setInterval>;
      }
    } else {
      if (displayedChars > 0) {
        intervalRef.current = setInterval(() => {
          setDisplayedChars((prev) => prev - 1);
        }, 30);
      } else {
        setWordIndex((prev) => (prev + 1) % subtitleWords.length);
        setIsTyping(true);
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [wordIndex, isTyping, displayedChars]);

  const nameLine1 = 'MOHANED';
  const nameLine2 = 'ABDELAAL';

  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el as HTMLElement, { offset: -64 });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      <ThreeBackground />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Name Line 1 */}
        <motion.div
          className="flex overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {nameLine1.split('').map((letter, i) => (
            <motion.span
              key={`l1-${i}`}
              initial={{ opacity: 0, y: 30, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3 + i * 0.03 + Math.random() * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.1,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Name Line 2 */}
        <motion.div
          className="flex overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {nameLine2.split('').map((letter, i) => (
            <motion.span
              key={`l2-${i}`}
              initial={{ opacity: 0, y: 30, rotateX: -45 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + i * 0.03 + Math.random() * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                fontWeight: 700,
                color: 'var(--color-accent-primary)',
                lineHeight: 1.1,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        {/* Typewriter Subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-4 flex items-center gap-1"
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              color: 'var(--color-text-secondary)',
              minHeight: '2.5rem',
            }}
          >
            {subtitleWords[wordIndex].slice(0, displayedChars)}
          </span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              color: 'var(--color-accent-primary)',
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              fontWeight: 300,
            }}
          >
            |
          </motion.span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="mt-3 uppercase tracking-[0.1em]"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.875rem',
            color: 'var(--color-text-secondary)',
          }}
        >
          Creative Visual Solutions
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <button onClick={() => handleScrollTo('#projects')} className="btn-primary">
            View My Work
          </button>
          <button onClick={() => handleScrollTo('#contact')} className="btn-secondary">
            Contact Me
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 0.5, delay: 2.2 }}
          onClick={() => handleScrollTo('#about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ animation: 'bounce-slow 1.5s ease-in-out infinite' }}
        >
          <FontAwesomeIcon
            icon={faChevronDown}
            style={{ color: 'var(--color-text-secondary)', fontSize: '1.25rem' }}
          />
        </motion.button>
      </div>
    </section>
  );
}
