import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMilestones } from '@/hooks/useSharedData';
import ParticleField from '@/components/ParticleField';

gsap.registerPlugin(ScrollTrigger);

export default function WhoAmI() {
  const milestones = useMilestones();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !sectionRef.current || !trackRef.current) return;

    const track = trackRef.current;
    const trackWidth = track.scrollWidth;
    const viewportWidth = window.innerWidth;
    const scrollDistance = trackWidth - viewportWidth;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Horizontal scroll
      gsap.to(track, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollDistance + 400}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Card entrance animations
      const cards = track.querySelectorAll('.milestone-card');
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { scale: 0.9, opacity: 0, y: 20 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${i * 300} top`,
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="whoami"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: 'var(--color-bg-primary)',
        minHeight: '100vh',
      }}
    >
      <ParticleField />

      <div className="relative z-10">
        {/* Title */}
        <div ref={titleRef} className="pt-24 pb-8 text-center section-container">
          <span
            className="text-xs uppercase tracking-[0.15em] font-semibold"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            My Story
          </span>
          <h2 className="section-title mt-2">
            My <span className="accent">Journey</span>
          </h2>
        </div>

        {/* Timeline - Horizontal scroll on desktop, vertical on mobile */}
        <div
          ref={trackRef}
          className={isMobile ? 'section-container pb-24' : 'flex items-center px-16'}
          style={isMobile ? {} : { height: 'calc(100vh - 200px)', gap: '2rem' }}
        >
          {/* Connector line - desktop only */}
          {!isMobile && (
            <div
              className="absolute left-0 right-0 h-0.5"
              style={{
                background: 'var(--color-border)',
                top: '50%',
              }}
            />
          )}

          {milestones.map((milestone, i) => (
            <div
              key={i}
              className={`milestone-card card-glass p-8 flex-shrink-0 ${
                isMobile ? 'mb-6' : ''
              }`}
              style={{
                width: isMobile ? '100%' : '320px',
                background: 'var(--color-card-bg)',
                opacity: 0.9,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(74, 144, 217, 0.15)' }}
              >
                <FontAwesomeIcon
                  icon={['fas', milestone.icon as any]}
                  style={{ color: 'var(--color-accent-primary)', fontSize: '1.5rem' }}
                />
              </div>

              <span
                className="text-sm font-semibold"
                style={{ color: 'var(--color-accent-primary)' }}
              >
                {milestone.period}
              </span>

              <h3
                className="mt-2 text-lg font-semibold"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {milestone.title}
              </h3>

              <p
                className="mt-2 text-sm"
                style={{
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                }}
              >
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
