import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLayerGroup, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks/useSharedData';
import { useTilt } from '@/hooks/useTilt';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: faClock, value: '5+', label: 'Years Experience' },
  { icon: faLayerGroup, value: '3', label: 'Service Types' },
  { icon: faGlobe, value: '15+', label: 'Happy Clients' },
];

function StatCard({ icon, value, label }: { icon: typeof faClock; value: string; label: string }) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt({ max: 8 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="card-glass p-6 text-center flex-1 min-w-[140px]"
      style={{ transition: 'transform 0.1s ease-out' }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
        style={{ background: 'rgba(74, 144, 217, 0.15)' }}
      >
        <FontAwesomeIcon icon={icon} style={{ color: 'var(--color-accent-primary)', fontSize: '1.25rem' }} />
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--color-accent-primary)',
        }}
      >
        {value}
      </div>
      <div
        className="text-xs uppercase tracking-wider mt-1"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </div>
    </div>
  );
}

export default function About() {
  const settings = useSettings();
  const sectionRef = useRef<HTMLElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ownerPhoto = settings.ownerPhoto || './assets/owner-photo.jpg';
  const aboutText = settings.aboutText || 'With a background in dentistry and a passion for visual creativity, I bring a unique attention to detail to every project. I specialize in graphic design, video editing, and WordPress development \u2014 helping brands tell their stories across digital platforms. Based in El-Minya, Egypt, I work with clients locally and internationally to deliver creative solutions that make an impact.';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        photoRef.current,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        contentRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full py-24"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Photo */}
          <div className="lg:col-span-5" ref={photoRef}>
            <div className="relative max-w-md mx-auto lg:mx-0">
              {/* Decorative shape behind */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: 'polygon(10% 0%, 100% 0%, 90% 10%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)',
                  background: 'var(--color-accent-primary)',
                  opacity: 0.2,
                  transform: 'translate(12px, 12px) scale(1.08)',
                }}
              />
              {/* Photo container */}
              <div
                style={{
                  clipPath: 'polygon(10% 0%, 100% 0%, 90% 10%, 100% 80%, 90% 100%, 10% 100%, 0% 80%, 0% 20%)',
                  overflow: 'hidden',
                  aspectRatio: '3/4',
                }}
              >
                <img
                  src={ownerPhoto}
                  alt="Mohaned Abdelaal"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-7" ref={contentRef}>
            <span
              className="text-xs uppercase tracking-[0.15em] font-semibold"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              About Me
            </span>

            <h2
              className="mt-3"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
              }}
            >
              Crafting Visual Stories That Connect
            </h2>

            <p
              className="mt-4"
              style={{
                color: 'var(--color-text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.7,
                maxWidth: '55ch',
              }}
            >
              {aboutText}
            </p>

            {/* Stats */}
            <div className="mt-8 flex flex-wrap gap-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
