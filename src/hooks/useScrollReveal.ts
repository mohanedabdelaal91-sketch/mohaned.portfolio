import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  scale?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
  childSelector?: string;
}

export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null);

  const {
    y = 40,
    x = 0,
    opacity = 0,
    scale = 1,
    duration = 0.8,
    stagger = 0.1,
    delay = 0,
    ease = 'power3.out',
    start = 'top 80%',
    childSelector,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = childSelector ? el.querySelectorAll(childSelector) : el;

    const fromVars: gsap.TweenVars = {
      y,
      x,
      opacity,
      scale,
    };

    const toVars: gsap.TweenVars = {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      duration,
      stagger,
      delay,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
    };

    gsap.fromTo(targets, fromVars, toVars);

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [y, x, opacity, scale, duration, stagger, delay, ease, start, childSelector]);

  return ref;
}
