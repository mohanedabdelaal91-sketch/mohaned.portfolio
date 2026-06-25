import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useClients } from '@/hooks/useSharedData';

gsap.registerPlugin(ScrollTrigger);

function ClientCard({ client }: { client: { id: string; name: string; icon: string } }) {
  return (
    <div
      className="flex-shrink-0 px-6 py-5 rounded-xl transition-all duration-300 hover:-translate-y-1"
      style={{
        width: '280px',
        background: 'var(--color-card-bg)',
        border: '1px solid var(--color-border)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(74, 144, 217, 0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(74, 144, 217, 0.15)' }}
        >
          <FontAwesomeIcon
            icon={['fas', client.icon as any]}
            style={{ color: 'var(--color-accent-primary)', fontSize: '1rem' }}
          />
        </div>
        <span
          className="font-semibold text-sm"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--color-text-primary)',
          }}
        >
          {client.name}
        </span>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: { id: string; name: string; icon: string }[];
  direction: 'left' | 'right';
}) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden py-2">
      <div
        className="flex gap-4 w-max"
        style={{
          animation: `marquee-${direction} 30s linear infinite`,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
        }}
      >
        {doubled.map((client, i) => (
          <ClientCard key={`${client.id}-${i}`} client={client} />
        ))}
      </div>
    </div>
  );
}

export default function Clients() {
  const clients = useClients();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const clientsList = Array.isArray(clients) ? clients : [];
  const mid = Math.ceil(clientsList.length / 2);
  const row1 = clientsList.slice(0, mid);
  const row2 = clientsList.slice(mid);

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

  return (
    <section
      id="clients"
      ref={sectionRef}
      className="w-full py-20 overflow-hidden"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="section-container mb-10">
        <div ref={titleRef} className="text-center">
          <span
            className="text-xs uppercase tracking-[0.15em] font-semibold"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            Trusted By
          </span>
          <h2 className="section-title mt-2">
            Clients I&apos;ve <span className="accent">Worked With</span>
          </h2>
        </div>
      </div>

      <MarqueeRow items={row1} direction="left" />
      <MarqueeRow items={row2} direction="right" />
    </section>
  );
}
