import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useLenisContext } from '@/context/LenisContext';

export default function Footer() {
  const lenisRef = useLenisContext();

  const handleBackToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0);
    }
  };

  return (
    <footer
      className="w-full py-8"
      style={{
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg-primary)',
      }}
    >
      <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p
          className="text-sm"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          &copy; {new Date().getFullYear()} Mohaned Abdelaal. All rights reserved.
        </p>

        <button
          onClick={handleBackToTop}
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-80"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Back to Top
          <FontAwesomeIcon
            icon={faArrowUp}
            className="text-xs transition-transform duration-200 group-hover:-translate-y-0.5"
          />
        </button>
      </div>
    </footer>
  );
}
