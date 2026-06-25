import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSkills } from '@/hooks/useSharedData';
import FloatingOrbs from '@/components/FloatingOrbs';

gsap.registerPlugin(ScrollTrigger);

const skillTabs = ['Graphic Design', 'Video Editing', 'WordPress Development'];

function CircularProgress({ percentage, name }: { percentage: number; name: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (!svgRef.current) return;

    const circle = svgRef.current.querySelector('.progress-arc');
    if (!circle) return;

    gsap.fromTo(
      circle,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: offset,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: svgRef.current,
          start: 'top 85%',
        },
      }
    );
  }, [offset, circumference]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg
          ref={svgRef}
          width="140"
          height="140"
          viewBox="0 0 120 120"
          className="transform -rotate-90"
        >
          {/* Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          <circle
            className="progress-arc"
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--color-accent-primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transition: 'none' }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
          }}
        >
          {percentage}%
        </div>
      </div>
      <span
        className="text-sm"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {name}
      </span>
    </div>
  );
}

export default function Skills() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const skills = useSkills();
  const skillsList = Array.isArray(skills) ? skills : [];
  const filteredSkills = skillsList.filter((s) => s.category === skillTabs[activeTab]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
    );
  }, [activeTab]);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full py-24 overflow-hidden"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <FloatingOrbs />

      <div className="relative z-10 section-container">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-12">
          <span
            className="text-xs uppercase tracking-[0.15em] font-semibold"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            Expertise
          </span>
          <h2 className="section-title mt-2">
            My <span className="accent">Skills</span>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {skillTabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200"
              style={{
                background: activeTab === i ? 'var(--color-accent-primary)' : 'transparent',
                color: activeTab === i ? 'white' : 'var(--color-text-secondary)',
                border: activeTab === i
                  ? '1px solid transparent'
                  : '1px solid var(--color-border)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Progress Indicators */}
        <div
          ref={contentRef}
          className="flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {filteredSkills.map((skill) => (
            <CircularProgress
              key={skill.name}
              percentage={skill.percentage}
              name={skill.name}
            />
          ))}
        </div>

        {/* Software badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-3">
          {['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'CapCut', 'WordPress', 'AI Tools'].map(
            (sw) => (
              <span
                key={sw}
                className="px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: 'var(--color-card-bg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {sw}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
