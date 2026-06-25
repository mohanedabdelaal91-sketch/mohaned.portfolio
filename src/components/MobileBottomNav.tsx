import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUser,
  faBriefcase,
  faStar,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { useLenisContext } from '@/context/LenisContext';

const navItems = [
  { icon: faHouse, label: 'Home', href: '#hero' },
  { icon: faUser, label: 'About', href: '#about' },
  { icon: faBriefcase, label: 'Work', href: '#projects' },
  { icon: faStar, label: 'Skills', href: '#skills' },
  { icon: faEnvelope, label: 'Contact', href: '#contact' },
];

export default function MobileBottomNav() {
  const lenisRef = useLenisContext();
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'skills', 'clients', 'contact'];
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            setActive(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target && lenisRef.current) {
      lenisRef.current.scrollTo(target as HTMLElement, { offset: -64 });
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'var(--color-glass-bg)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const sectionId = item.href.slice(1);
          const isActive = active === sectionId;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleClick(e, item.href)}
              className="flex flex-col items-center justify-center gap-0.5 transition-all duration-200"
              style={{
                color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
              }}
            >
              <FontAwesomeIcon icon={item.icon} className="text-lg" />
              <span
                className="text-[10px] font-medium transition-all duration-200"
                style={{
                  opacity: isActive ? 1 : 0,
                  height: isActive ? 'auto' : 0,
                  overflow: 'hidden',
                }}
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
