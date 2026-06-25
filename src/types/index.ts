export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  client: string;
  tools: string[];
  year: number;
  status: 'draft' | 'published';
  thumbnailUrl: string;
  images: string[];
  categories: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  icon: string;
  logoUrl?: string;
  website?: string;
  displayOrder: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SiteSettings {
  ownerName: string;
  tagline: string;
  aboutText: string;
  milestones: Milestone[];
  skills: Skill[];
  socialLinks: SocialLinks;
  contactInfo: ContactInfo;
  themeColors: ThemeColors;
  fontChoice: string;
  sectionVisibility: Record<string, boolean>;
  seo: SEOSettings;
  heroBgType: string;
}

export interface Milestone {
  period: string;
  icon: string;
  title: string;
  description: string;
}

export interface Skill {
  name: string;
  percentage: number;
  category: string;
}

export interface SocialLinks {
  behance?: string;
  linkedin?: string;
  instagram?: string;
  whatsapp?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  location: string;
}

export interface ThemeColors {
  accentPrimary: string;
  accentSecondary: string;
  bgLight: string;
  bgDark: string;
  textPrimaryLight: string;
  textPrimaryDark: string;
  cardBgLight: string;
  cardBgDark: string;
}

export interface SEOSettings {
  title: string;
  description: string;
  ogImage?: string;
}

export type ServiceType = 'Graphic Design' | 'Video Editing' | 'WordPress Development' | 'Other';
