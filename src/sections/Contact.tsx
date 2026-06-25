import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faEnvelope,
  faLocationDot,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import {
  faBehance,
  faLinkedin,
  faInstagram,
  faWhatsapp,
  faFacebook,
} from '@fortawesome/free-brands-svg-icons';
import { useSettings } from '@/hooks/useSharedData';
import RotatingTorus from '@/components/RotatingTorus';

gsap.registerPlugin(ScrollTrigger);

function AnimatedCheckmark() {
  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className="mx-auto mb-4"
    >
      <motion.circle
        cx="40"
        cy="40"
        r="36"
        fill="none"
        stroke="var(--color-success)"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
      <motion.path
        d="M25 42 L35 52 L55 32"
        fill="none"
        stroke="var(--color-success)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

export default function Contact() {
  const settings = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    serviceType: '',
    message: '',
  });
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const infoCards = [
    { icon: faPhone, label: 'Phone', value: settings.phone || '+20 155 587 3803', href: `tel:${(settings.phone || '+20 155 587 3803').replace(/\s/g, '')}` },
    { icon: faEnvelope, label: 'Email', value: settings.email || 'mohanedabdelaal91@gmail.com', href: `mailto:${settings.email || 'mohanedabdelaal91@gmail.com'}` },
    { icon: faLocationDot, label: 'Location', value: settings.location || 'El-Minya, Egypt', href: '#' },
    { icon: faClock, label: 'Response Time', value: 'Within 24 hours', href: '#' },
  ];

  const socials = [
    { icon: faBehance, href: settings.behance || 'https://behance.net/mohanedabdelaal', label: 'Behance' },
    { icon: faLinkedin, href: settings.linkedin || 'https://linkedin.com/in/mohanedabdelaal', label: 'LinkedIn' },
    { icon: faInstagram, href: settings.instagram || 'https://instagram.com/mohanedabdelaal', label: 'Instagram' },
    { icon: faFacebook, href: settings.facebook || 'https://facebook.com/mohanedabdelaal', label: 'Facebook' },
    { icon: faWhatsapp, href: `https://wa.me/${settings.whatsapp || '+201555873803'}`, label: 'WhatsApp' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current?.children || [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { x: 40, opacity: 0 },
        {
          x: 0,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
  };

  const inputStyle = {
    background: 'var(--color-bg-primary)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: 'var(--color-text-primary)',
    width: '100%',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-24 overflow-hidden"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <RotatingTorus />

      <div className="relative z-10 section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left - Info */}
          <div className="lg:col-span-5" ref={leftRef}>
            <span
              className="text-xs uppercase tracking-[0.15em] font-semibold"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              Get in Touch
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
              Let&apos;s Work Together
            </h2>
            <p
              className="mt-3 mb-8"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
            >
              Have a project in mind? Let&apos;s discuss how I can help bring your vision to life.
            </p>

            {/* Info Cards */}
            <div className="flex flex-col gap-3">
              {infoCards.map((card) => (
                <a
                  key={card.label}
                  href={card.href}
                  className="flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'var(--color-card-bg)',
                    border: '1px solid var(--color-border)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent-primary)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(74, 144, 217, 0.15)' }}
                  >
                    <FontAwesomeIcon
                      icon={card.icon}
                      style={{ color: 'var(--color-accent-primary)', fontSize: '1rem' }}
                    />
                  </div>
                  <div>
                    <span
                      className="text-xs uppercase tracking-wider block"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {card.label}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {card.value}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'var(--color-card-bg)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--color-accent-primary)';
                    el.style.color = 'white';
                    el.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--color-card-bg)';
                    el.style.color = 'var(--color-text-secondary)';
                    el.style.transform = 'scale(1)';
                  }}
                >
                  <FontAwesomeIcon icon={social.icon} className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Right - Form */}
          <div className="lg:col-span-7" ref={rightRef}>
            <div
              className="p-8 rounded-2xl"
              style={{
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
              }}
            >
              {submitted ? (
                <div className="text-center py-12">
                  <AnimatedCheckmark />
                  <h3
                    className="text-xl font-semibold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    Message Sent Successfully!
                  </h3>
                  <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label
                      className="text-sm font-medium block mb-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium block mb-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium block mb-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+20XXXXXXXXXX"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium block mb-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Service Type
                    </label>
                    <select
                      required
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="">Select a service...</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="WordPress Development">WordPress Development</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="text-sm font-medium block mb-2"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell me about your project..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full mt-2">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
