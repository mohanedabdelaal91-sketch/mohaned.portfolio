import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed right-0 top-0 z-40 w-[3px] hidden lg:block"
      style={{ height: '100vh' }}
    >
      <div
        style={{
          width: '100%',
          height: `${progress}%`,
          background: 'var(--color-accent-primary)',
          transition: 'height 100ms linear',
        }}
      />
    </div>
  );
}
