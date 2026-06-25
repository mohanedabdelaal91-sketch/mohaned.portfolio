import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useThemeContext } from '@/context/ThemeContext';
import { useLenisContext } from '@/context/LenisContext';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Clients', href: '#clients' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useThemeContext();
  const lenisRef = useLenisContext();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const sections = ['about', 'skills', 'projects', 'clients', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target as HTMLElement, { offset: -64 });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'var(--color-glass-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
      }}
    >
      <div className="section-container flex items-center justify-between h-16">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (lenisRef.current) lenisRef.current.scrollTo(0);
          }}
          className="font-bold text-lg"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          Mohaned<span style={{ color: 'var(--color-accent-primary)' }}>.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-link text-sm font-medium"
              style={{
                color: activeSection === link.href.slice(1)
                  ? 'var(--color-accent-primary)'
                  : 'var(--color-text-secondary)',
              }}
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: 'var(--color-card-bg)',
              border: '1px solid var(--color-border)',
            }}
            aria-label="Toggle theme"
          >
            <FontAwesomeIcon
              icon={theme === 'dark' ? faSun : faMoon}
              className="transition-transform duration-300"
              style={{
                color: 'var(--color-accent-primary)',
                transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
