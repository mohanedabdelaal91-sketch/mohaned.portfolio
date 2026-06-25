import { useState, useEffect } from 'react';
import {
  projects as defaultProjects,
  clients as defaultClients,
  categories as defaultCategories,
  milestones as defaultMilestones,
  skills as defaultSkills,
  socialLinks as defaultSocialLinks,
  contactInfo as defaultContactInfo,
} from '@/data/portfolioData';

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/* Seed localStorage with defaults on first visit */
function seedIfEmpty() {
  if (!localStorage.getItem('cms_projects')) {
    const mapped = defaultProjects.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.categories[0] || 'Graphic Design',
      categories: p.categories,
      client: p.client,
      tools: Array.isArray(p.tools) ? p.tools : [],
      year: p.year,
      shortDescription: p.shortDescription,
      fullDescription: p.fullDescription || p.shortDescription,
      status: 'published' as const,
      thumbnailUrl: p.thumbnailUrl,
      images: p.images || [p.thumbnailUrl],
      videoUrl: '',
      createdAt: new Date().toISOString(),
    }));
    localStorage.setItem('cms_projects', JSON.stringify(mapped));
  }
  if (!localStorage.getItem('cms_clients')) {
    localStorage.setItem('cms_clients', JSON.stringify(defaultClients));
  }
  if (!localStorage.getItem('cms_categories')) {
    localStorage.setItem('cms_categories', JSON.stringify(defaultCategories));
  }
  if (!localStorage.getItem('cms_milestones')) {
    localStorage.setItem('cms_milestones', JSON.stringify(defaultMilestones));
  }
  if (!localStorage.getItem('cms_skills')) {
    localStorage.setItem('cms_skills', JSON.stringify(defaultSkills));
  }
  if (!localStorage.getItem('cms_settings')) {
    localStorage.setItem(
      'cms_settings',
      JSON.stringify({
        ownerName: 'Mohaned Abdelaal',
        tagline: 'Creative Visual Solutions',
        email: defaultContactInfo.email,
        phone: defaultContactInfo.phone,
        location: defaultContactInfo.location,
        aboutText:
          'With a background in dentistry and a passion for visual creativity, I bring a unique attention to detail to every project. I specialize in graphic design, video editing, and WordPress development \u2014 helping brands tell their stories across digital platforms. Based in El-Minya, Egypt, I work with clients locally and internationally to deliver creative solutions that make an impact.',
        behance: defaultSocialLinks.behance,
        linkedin: defaultSocialLinks.linkedin,
        instagram: defaultSocialLinks.instagram,
        facebook: 'https://facebook.com/mohanedabdelaal',
        whatsapp: defaultSocialLinks.whatsapp,
        metaTitle: 'Mohaned Abdelaal | Creative Designer',
        metaDescription:
          'Portfolio of Mohaned Abdelaal - Graphic Designer, Video Editor, WordPress Developer',
        ownerPhoto: './assets/owner-photo.jpg',
      })
    );
  }
}

/* Subscribe to localStorage changes across tabs + force refresh */
function useStorage<T>(key: string, fallback: T): T {
  const [value, setValue] = useState<T>(() => {
    seedIfEmpty();
    return getStorage(key, fallback);
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : fallback);
      }
    };
    const handleCustom = () => {
      setValue(getStorage(key, fallback));
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('cms-update', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cms-update', handleCustom);
    };
  }, [key]);

  return value;
}

export function useProjects() {
  return useStorage('cms_projects', defaultProjects);
}

export function useClients() {
  return useStorage('cms_clients', defaultClients);
}

export function useCategories() {
  return useStorage('cms_categories', defaultCategories);
}

export function useMilestones() {
  return useStorage('cms_milestones', defaultMilestones);
}

export function useSkills() {
  return useStorage('cms_skills', defaultSkills);
}

export interface SiteSettings {
  ownerName: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  aboutText: string;
  behance: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  metaTitle: string;
  metaDescription: string;
  ownerPhoto: string;
}

export function useSettings(): SiteSettings {
  return useStorage('cms_settings', {
    ownerName: 'Mohaned Abdelaal',
    tagline: 'Creative Visual Solutions',
    email: defaultContactInfo.email,
    phone: defaultContactInfo.phone,
    location: defaultContactInfo.location,
    aboutText:
      'With a background in dentistry and a passion for visual creativity, I bring a unique attention to detail to every project. I specialize in graphic design, video editing, and WordPress development \u2014 helping brands tell their stories across digital platforms. Based in El-Minya, Egypt, I work with clients locally and internationally to deliver creative solutions that make an impact.',
    behance: defaultSocialLinks.behance,
    linkedin: defaultSocialLinks.linkedin,
    instagram: defaultSocialLinks.instagram,
    facebook: 'https://facebook.com/mohanedabdelaal',
    whatsapp: defaultSocialLinks.whatsapp,
    metaTitle: 'Mohaned Abdelaal | Creative Designer',
    metaDescription:
      'Portfolio of Mohaned Abdelaal - Graphic Designer, Video Editor, WordPress Developer',
    ownerPhoto: './assets/owner-photo.jpg',
  });
}

/* Dashboard uses this to broadcast changes so public site updates live */
export function broadcastUpdate() {
  window.dispatchEvent(new Event('cms-update'));
}
