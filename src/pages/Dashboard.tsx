import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge, faFolderOpen, faTags, faUsers, faPalette, faGear,
  faEnvelope, faRightFromBracket, faBars, faTimes, faPlus,
  faEdit, faTrash, faEye, faSave, faXmark, faCheckCircle,
  faSearch, faSun, faMoon, faChevronLeft,
  faUpload, faImage, faVideo, faCopy, faCamera,
} from '@fortawesome/free-solid-svg-icons';
import { projects as defaultProjects, clients as defaultClients, categories as defaultCategories } from '@/data/portfolioData';
import { broadcastUpdate } from '@/hooks/useSharedData';

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  categories: string[];
  client: string;
  tools: string[];
  year: number;
  shortDescription: string;
  fullDescription: string;
  status: 'draft' | 'published';
  thumbnailUrl: string;
  images: string[];
  videoUrl?: string;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  icon: string;
  logoUrl?: string;
  website?: string;
  displayOrder: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  serviceType: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  name: string;
  url: string;
  thumbnail?: string;
  createdAt: string;
  size?: string;
}

interface SiteSettings {
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

/* ═══════════════════════════════════════════
   STORAGE HELPERS
   ═══════════════════════════════════════════ */
function getStorage<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}
function setStorage<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)); }

function initStorage() {
  if (!localStorage.getItem('cms_projects')) {
    const mapped: Project[] = defaultProjects.map(p => ({
      id: p.id, title: p.title, slug: p.slug, category: p.categories[0] || 'Graphic Design',
      categories: p.categories, client: p.client, tools: Array.isArray(p.tools) ? p.tools : [],
      year: p.year, shortDescription: p.shortDescription, fullDescription: p.fullDescription || p.shortDescription,
      status: 'published', thumbnailUrl: p.thumbnailUrl, images: p.images || [p.thumbnailUrl],
      videoUrl: '', createdAt: new Date().toISOString(),
    }));
    setStorage('cms_projects', mapped);
  }
  if (!localStorage.getItem('cms_clients')) setStorage('cms_clients', defaultClients);
  if (!localStorage.getItem('cms_categories')) setStorage('cms_categories', defaultCategories);
  if (!localStorage.getItem('cms_messages')) {
    setStorage('cms_messages', [
      { id: '1', name: 'Ahmed Mohamed', email: 'ahmed@example.com', serviceType: 'Graphic Design', message: 'I need a logo design for my new restaurant.', isRead: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: '2', name: 'Sarah Khalil', email: 'sarah@example.com', serviceType: 'WordPress', message: 'I want to build a medical clinic website.', isRead: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
      { id: '3', name: 'Omar Hassan', email: 'omar@example.com', serviceType: 'Video Editing', message: 'Can you edit my YouTube videos?', isRead: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
    ]);
  }
  if (!localStorage.getItem('cms_media')) setStorage('cms_media', []);
  if (!localStorage.getItem('cms_settings')) {
    setStorage('cms_settings', {
      ownerName: 'Mohaned Abdelaal', tagline: 'Creative Visual Solutions',
      email: 'mohanedabdelaal91@gmail.com', phone: '+20 155 587 3803', location: 'El-Minya, Egypt',
      aboutText: 'With a background in dentistry and a passion for visual creativity...',
      behance: 'https://behance.net/mohanedabdelaal', linkedin: 'https://linkedin.com/in/mohanedabdelaal',
      instagram: 'https://instagram.com/mohanedabdelaal', facebook: 'https://facebook.com/mohanedabdelaal',
      whatsapp: '+201555873803',
      metaTitle: 'Mohaned Abdelaal | Creative Designer',
      metaDescription: 'Portfolio of Mohaned Abdelaal - Graphic Designer, Video Editor, WordPress Developer',
      ownerPhoto: './assets/owner-photo.jpg',
    });
  }
}

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */
const navItems = [
  { icon: faGauge, label: 'Overview', path: '' },
  { icon: faFolderOpen, label: 'Projects', path: 'projects' },
  { icon: faTags, label: 'Categories', path: 'categories' },
  { icon: faUsers, label: 'Clients', path: 'clients' },
  { icon: faImage, label: 'Media', path: 'media' },
  { icon: faPalette, label: 'Appearance', path: 'appearance' },
  { icon: faGear, label: 'Settings', path: 'settings' },
  { icon: faEnvelope, label: 'Messages', path: 'messages' },
];

const CATEGORY_CHOICES = ['Graphic Design', 'Video Editing', 'WordPress', 'Branding', 'Social Media'];
const STATUS_CHOICES = ['draft', 'published'];
/* ═══════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════ */
function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1.5" style={{ color: '#64748B' }}>{label}</label>}
      <input className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-all duration-200" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#4A90D9'; }} onBlur={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; }} {...props} />
    </div>
  );
}

function Select({ label, options, ...props }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1.5" style={{ color: '#64748B' }}>{label}</label>}
      <select className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }} {...props}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1.5" style={{ color: '#64748B' }}>{label}</label>}
      <textarea className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-y" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A', minHeight: '80px' }} {...props} />
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl p-5 ${className}`} style={{ background: 'white', border: '1px solid #E2E8F0' }}>{children}</div>;
}

function BtnPrimary({ children, onClick, className = '', type = 'button' as const }: { children: React.ReactNode; onClick?: () => void; className?: string; type?: 'button' | 'submit' }) {
  return <button type={type} onClick={onClick} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:brightness-110 ${className}`} style={{ background: '#4A90D9' }}>{children}</button>;
}

function BtnSecondary({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${className}`} style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' }}>{children}</button>;
}

function BtnDanger({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:brightness-110 ${className}`} style={{ background: '#EF4444' }}>{children}</button>;
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6" style={{ background: 'white' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold" style={{ color: '#0F172A' }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F1F5F9' }}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   IMAGE UPLOAD BOX
   ═══════════════════════════════════════════ */
function ImageUploadBox({ label, value, onChange, placeholder = './assets/project-thumb-1.jpg' }: { label: string; value: string; onChange: (url: string) => void; placeholder?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('Image too large. Max 3MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setLocalPreview(result);
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const currentImage = localPreview || value || placeholder;

  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: '#64748B' }}>{label}</label>
      <div className="relative rounded-xl overflow-hidden group" style={{ border: '2px dashed #E2E8F0', minHeight: '160px' }}>
        {currentImage ? (
          <div className="relative">
            <img src={currentImage} alt="Preview" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#4A90D9' }}>
                <FontAwesomeIcon icon={faUpload} /> Change
              </button>
              <button type="button" onClick={() => { setLocalPreview(''); onChange(''); }} className="px-3 py-2 rounded-lg text-sm text-white" style={{ background: '#EF4444' }}>
                <FontAwesomeIcon icon={faTrash} /> Remove
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-40 flex flex-col items-center justify-center gap-2 text-sm" style={{ color: '#94A3B8' }}>
            <FontAwesomeIcon icon={faCamera} className="text-2xl" />
            <span>Click to upload image</span>
            <span className="text-xs">or paste URL below</span>
          </button>
        )}
        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <div className="flex gap-2 mt-2">
        <input type="text" value={localPreview || value} onChange={(e) => { setLocalPreview(''); onChange(e.target.value); }} placeholder="Image URL or base64..." className="flex-1 text-xs px-3 py-2 rounded-lg outline-none" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GALLERY IMAGE FIELDS (multiple uploads)
   ═══════════════════════════════════════════ */
function GalleryImageFields({ images, onChange }: { images: string[]; onChange: (imgs: string[]) => void }) {
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const addField = () => onChange([...images, '']);

  const updateField = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    onChange(updated.filter(Boolean));
  };

  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('Image too large. Max 3MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const updated = [...images];
      updated[index] = result;
      onChange(updated.filter((v, i) => v !== '' || i < updated.length - 1));
    };
    reader.readAsDataURL(file);
  };

  const removeField = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const displayFields = images.length === 0 ? [''] : [...images, ''];

  return (
    <div className="flex flex-col gap-2">
      {displayFields.map((img, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={img}
            onChange={(e) => updateField(i, e.target.value)}
            placeholder="Image URL..."
            className="flex-1 text-sm px-3 py-2 rounded-lg outline-none"
            style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
          />
          <input
            type="file"
            accept="image/*"
            ref={(el) => { fileRefs.current[i] = el; }}
            className="hidden"
            onChange={(e) => handleFileUpload(i, e)}
          />
          <button
            type="button"
            onClick={() => fileRefs.current[i]?.click()}
            className="px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0' }}
          >
            <FontAwesomeIcon icon={faUpload} />
          </button>
          {images[i] && (
            <button
              type="button"
              onClick={() => removeField(i)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-white"
              style={{ background: '#EF4444' }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addField}
        className="self-start flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium mt-1"
        style={{ background: '#EFF6FF', color: '#4A90D9' }}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Image
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   OVERVIEW PAGE
   ═══════════════════════════════════════════ */
function OverviewPage() {
  const projects: Project[] = getStorage('cms_projects', []);
  const clients: Client[] = getStorage('cms_clients', []);
  const messages: Message[] = getStorage('cms_messages', []);
  const media: MediaItem[] = getStorage('cms_media', []);
  const unread = messages.filter(m => !m.isRead).length;

  const stats = [
    { label: 'Total Projects', value: projects.length, color: '#4A90D9', icon: faFolderOpen },
    { label: 'Total Clients', value: clients.length, color: '#10B981', icon: faUsers },
    { label: 'Unread Messages', value: unread, color: '#F59E0B', icon: faEnvelope },
    { label: 'Media Files', value: media.length, color: '#EC4899', icon: faImage },
  ];

  const recent = [...projects].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F172A' }}>Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="!p-5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: `${s.color}15` }}>
              <FontAwesomeIcon icon={s.icon} style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: '#0F172A' }}>{s.value}</div>
            <div className="text-sm mt-0.5" style={{ color: '#64748B' }}>{s.label}</div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#0F172A' }}>Recent Projects</h3>
          {recent.length === 0 ? <p className="text-sm" style={{ color: '#64748B' }}>No projects yet.</p> : (
            <div className="space-y-2">
              {recent.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: '#F8FAFC' }}>
                  <img src={p.thumbnailUrl || './assets/project-thumb-1.jpg'} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#0F172A' }}>{p.title}</div>
                    <div className="text-xs" style={{ color: '#64748B' }}>{p.client}</div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${p.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#0F172A' }}>Recent Messages</h3>
          {messages.slice(0, 5).map(m => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: m.isRead ? '#F8FAFC' : '#EFF6FF' }}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${m.isRead ? 'bg-gray-300' : 'bg-blue-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate" style={{ color: '#0F172A' }}>{m.name}</div>
                <div className="text-xs truncate" style={{ color: '#64748B' }}>{m.message}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROJECTS PAGE
   ═══════════════════════════════════════════ */
function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => setProjects(getStorage('cms_projects', [])), []);
  useEffect(() => { load(); }, [load]);

  const filtered = projects.filter(p => {
    const catMatch = filter === 'All' || p.category === filter || p.categories?.includes(filter);
    const statusMatch = statusFilter === 'All' || p.status === statusFilter;
    const searchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
    return catMatch && statusMatch && searchMatch;
  });

  const handleDelete = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setStorage('cms_projects', updated);
    setProjects(updated);
    broadcastUpdate();
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Projects</h2>
        <BtnPrimary onClick={() => navigate('/dashboard/projects/new')}><FontAwesomeIcon icon={faPlus} /> Add New Project</BtnPrimary>
      </div>
      <Card className="mb-6 !p-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <FontAwesomeIcon icon={faSearch} style={{ color: '#94A3B8' }} />
            <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent" style={{ color: '#0F172A' }} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="text-sm outline-none bg-transparent px-2" style={{ color: '#0F172A' }}>
            {['All', ...CATEGORY_CHOICES].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-sm outline-none bg-transparent px-2" style={{ color: '#0F172A' }}>
            <option value="All">All Status</option><option value="published">Published</option><option value="draft">Draft</option>
          </select>
        </div>
      </Card>
      <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              {['Thumbnail', 'Title', 'Category', 'Client', 'Status', 'Year', 'Actions'].map(h => <th key={h} className="text-left p-4 text-xs uppercase font-medium" style={{ color: '#64748B' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={7} className="p-8 text-center text-sm" style={{ color: '#64748B' }}>No projects found.</td></tr> : filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td className="p-4"><img src={p.thumbnailUrl || './assets/project-thumb-1.jpg'} alt="" className="w-12 h-8 rounded object-cover" /></td>
                  <td className="p-4 text-sm font-medium" style={{ color: '#0F172A' }}>{p.title}</td>
                  <td className="p-4"><span className="px-2 py-0.5 text-xs rounded-full" style={{ background: 'rgba(74,144,217,0.1)', color: '#4A90D9' }}>{p.category}</span></td>
                  <td className="p-4 text-sm" style={{ color: '#64748B' }}>{p.client}</td>
                  <td className="p-4"><span className={`px-2 py-0.5 text-xs rounded-full ${p.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{p.status}</span></td>
                  <td className="p-4 text-sm" style={{ color: '#64748B' }}>{p.year}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/dashboard/projects/edit/${p.id}`)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF', color: '#4A90D9' }}><FontAwesomeIcon icon={faEdit} className="text-xs" /></button>
                      <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2', color: '#EF4444' }}><FontAwesomeIcon icon={faTrash} className="text-xs" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <p className="text-sm mb-4" style={{ color: '#64748B' }}>Are you sure you want to delete this project? This action cannot be undone.</p>
        <div className="flex gap-3 justify-end"><BtnSecondary onClick={() => setDeleteId(null)}>Cancel</BtnSecondary><BtnDanger onClick={() => deleteId && handleDelete(deleteId)}><FontAwesomeIcon icon={faTrash} /> Delete</BtnDanger></div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROJECT FORM (Add / Edit)
   ═══════════════════════════════════════════ */
function ProjectFormPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isEdit = pathname.includes('/edit/');
  const editId = isEdit ? pathname.split('/edit/')[1] : null;

  const [form, setForm] = useState<Partial<Project>>({
    title: '', slug: '', category: 'Graphic Design', categories: ['Graphic Design'], client: '',
    tools: [], year: new Date().getFullYear(), shortDescription: '', fullDescription: '',
    status: 'draft', thumbnailUrl: '', images: [], videoUrl: '',
  });
  const [toolsInput, setToolsInput] = useState('');

  useEffect(() => {
    if (isEdit && editId) {
      const all: Project[] = getStorage('cms_projects', []);
      const found = all.find(p => p.id === editId);
      if (found) { setForm(found); setToolsInput(Array.isArray(found.tools) ? found.tools.join(', ') : ''); }
    }
  }, [isEdit, editId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const all: Project[] = getStorage('cms_projects', []);
    const tools = toolsInput.split(',').map(t => t.trim()).filter(Boolean);
    const slug = form.slug || form.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';
    const thumbnail = form.thumbnailUrl || './assets/project-thumb-1.jpg';
    const galleryImages = form.images?.length ? form.images.filter(Boolean) : [thumbnail];

    if (isEdit && editId) {
      const updated = all.map(p => p.id === editId ? { ...p, ...form, tools, slug, thumbnailUrl: thumbnail, images: galleryImages, categories: [form.category || 'Graphic Design'] } as Project : p);
      setStorage('cms_projects', updated);
    } else {
      const newProject: Project = {
        id: Date.now().toString(), title: form.title || '', slug, category: form.category || 'Graphic Design',
        categories: [form.category || 'Graphic Design'], client: form.client || '', tools,
        year: form.year || new Date().getFullYear(), shortDescription: form.shortDescription || '',
        fullDescription: form.fullDescription || '',
        status: (form.status as 'draft' | 'published') || 'draft', thumbnailUrl: thumbnail,
        images: galleryImages, videoUrl: form.videoUrl || '', createdAt: new Date().toISOString(),
      };
      setStorage('cms_projects', [...all, newProject]);
    }
    navigate('/dashboard/projects');
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard/projects')} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F1F5F9' }}><FontAwesomeIcon icon={faChevronLeft} className="text-xs" /></button>
        <h2 className="text-2xl font-bold" style={{ color: '#0F172A' }}>{isEdit ? 'Edit Project' : 'Add New Project'}</h2>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input label="Title *" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Project title" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Slug" value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
            <Input label="Client Name" value={form.client || ''} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="Client name" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Category *" value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} options={CATEGORY_CHOICES} />
            <Select label="Status" value={form.status || ''} onChange={e => setForm({ ...form, status: e.target.value as 'draft' | 'published' })} options={STATUS_CHOICES} />
            <Input label="Year" type="number" value={form.year || ''} onChange={e => setForm({ ...form, year: parseInt(e.target.value) })} />
          </div>
          <Input label="Tools (comma-separated)" value={toolsInput} onChange={e => setToolsInput(e.target.value)} placeholder="Photoshop, Illustrator, Premiere Pro" />

          {/* Image Upload */}
          <ImageUploadBox label="Cover Image (Thumbnail) *" value={form.thumbnailUrl || ''} onChange={(url) => setForm({ ...form, thumbnailUrl: url })} />

          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#64748B' }}>Gallery Images</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(form.images || []).filter(Boolean).map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover" />
                  <button type="button" onClick={() => setForm({ ...form, images: (form.images || []).filter((_, idx) => idx !== i) })} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">&times;</button>
                </div>
              ))}
            </div>
            <GalleryImageFields images={form.images || []} onChange={(imgs) => setForm({ ...form, images: imgs })} />
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#64748B' }}>Video URL (YouTube or Google Drive)</label>
            <input
              type="text"
              value={form.videoUrl || ''}
              onChange={e => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="https://youtube.com/watch?v=...  or  https://drive.google.com/file/d/..."
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A' }}
            />
            {form.videoUrl && form.videoUrl.includes('drive.google.com') && (
              <p className="text-xs mt-1" style={{ color: '#10B981' }}>
                <FontAwesomeIcon icon={faCheckCircle} /> Google Drive link detected
              </p>
            )}
            {form.videoUrl && form.videoUrl.includes('youtube.com') && (
              <p className="text-xs mt-1" style={{ color: '#10B981' }}>
                <FontAwesomeIcon icon={faCheckCircle} /> YouTube link detected
              </p>
            )}
          </div>

          <Textarea label="Short Description" value={form.shortDescription || ''} onChange={e => setForm({ ...form, shortDescription: e.target.value })} placeholder="Brief description..." rows={3} />
          <Textarea label="Full Description" value={form.fullDescription || ''} onChange={e => setForm({ ...form, fullDescription: e.target.value })} placeholder="Detailed description..." rows={5} />
          <div className="flex gap-3 pt-2">
            <BtnPrimary type="submit"><FontAwesomeIcon icon={faSave} /> {isEdit ? 'Update' : 'Save'} Project</BtnPrimary>
            <BtnSecondary onClick={() => navigate('/dashboard/projects')}>Cancel</BtnSecondary>
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CATEGORIES PAGE
   ═══════════════════════════════════════════ */
function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', icon: 'fa-palette', color: '#4A90D9' });

  const load = useCallback(() => setCategories(getStorage('cms_categories', [])), []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditCat(null); setForm({ name: '', icon: 'fa-palette', color: '#4A90D9' }); setIsOpen(true); };
  const openEdit = (cat: Category) => { setEditCat(cat); setForm({ name: cat.name, icon: cat.icon, color: cat.color }); setIsOpen(true); };

  const handleSave = () => {
    const all: Category[] = getStorage('cms_categories', []);
    if (editCat) setStorage('cms_categories', all.map(c => c.id === editCat.id ? { ...c, ...form } : c));
    else setStorage('cms_categories', [...all, { id: Date.now().toString(), ...form }]);
    load(); broadcastUpdate(); setIsOpen(false);
  };

  const handleDelete = (id: string) => { if (confirm('Delete this category?')) { setStorage('cms_categories', getStorage('cms_categories', []).filter((c: Category) => c.id !== id)); load(); broadcastUpdate(); } };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Categories</h2>
        <BtnPrimary onClick={openAdd}><FontAwesomeIcon icon={faPlus} /> Add Category</BtnPrimary>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
        <table className="w-full"><thead><tr style={{ borderBottom: '1px solid #E2E8F0' }}>
          {['Name', 'Icon', 'Color', 'Actions'].map(h => <th key={h} className="text-left p-4 text-xs uppercase font-medium" style={{ color: '#64748B' }}>{h}</th>)}
        </tr></thead><tbody>
          {categories.map(c => (<tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
            <td className="p-4 text-sm font-medium" style={{ color: '#0F172A' }}>{c.name}</td>
            <td className="p-4 text-sm" style={{ color: '#64748B' }}>{c.icon}</td>
            <td className="p-4"><div className="w-6 h-6 rounded" style={{ background: c.color }} /></td>
            <td className="p-4"><div className="flex gap-2"><button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF', color: '#4A90D9' }}><FontAwesomeIcon icon={faEdit} className="text-xs" /></button><button onClick={() => handleDelete(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2', color: '#EF4444' }}><FontAwesomeIcon icon={faTrash} className="text-xs" /></button></div></td>
          </tr>))}
        </tbody></table>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editCat ? 'Edit Category' : 'Add Category'}>
        <div className="flex flex-col gap-4">
          <Input label="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Category name" />
          <Input label="Icon Class" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} placeholder="fa-palette" />
          <div><label className="block text-sm font-medium mb-1.5" style={{ color: '#64748B' }}>Color</label><input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} className="w-full h-10 rounded-lg cursor-pointer" /></div>
          <div className="flex gap-3 justify-end"><BtnSecondary onClick={() => setIsOpen(false)}>Cancel</BtnSecondary><BtnPrimary onClick={handleSave}><FontAwesomeIcon icon={faSave} /> Save</BtnPrimary></div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CLIENTS PAGE
   ═══════════════════════════════════════════ */
function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editCl, setEditCl] = useState<Client | null>(null);
  const [form, setForm] = useState({ name: '', icon: 'fa-building', website: '', displayOrder: 0 });

  const load = useCallback(() => setClients(getStorage('cms_clients', [])), []);
  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditCl(null); setForm({ name: '', icon: 'fa-building', website: '', displayOrder: clients.length + 1 }); setIsOpen(true); };
  const openEdit = (c: Client) => { setEditCl(c); setForm({ name: c.name, icon: c.icon, website: c.website || '', displayOrder: c.displayOrder }); setIsOpen(true); };

  const handleSave = () => {
    const all: Client[] = getStorage('cms_clients', []);
    if (editCl) setStorage('cms_clients', all.map(c => c.id === editCl.id ? { ...c, ...form } : c));
    else setStorage('cms_clients', [...all, { id: Date.now().toString(), logoUrl: '', ...form }]);
    load(); broadcastUpdate(); setIsOpen(false);
  };

  const handleDelete = (id: string) => { if (confirm('Delete this client?')) { setStorage('cms_clients', getStorage('cms_clients', []).filter((c: Client) => c.id !== id)); load(); broadcastUpdate(); } };

  const iconNames = ['fa-snowflake', 'fa-bullhorn', 'fa-hospital', 'fa-stethoscope', 'fa-spa', 'fa-user-doctor', 'fa-building', 'fa-globe'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Clients</h2>
        <BtnPrimary onClick={openAdd}><FontAwesomeIcon icon={faPlus} /> Add Client</BtnPrimary>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
        <table className="w-full"><thead><tr style={{ borderBottom: '1px solid #E2E8F0' }}>
          {['Name', 'Icon', 'Website', 'Order', 'Actions'].map(h => <th key={h} className="text-left p-4 text-xs uppercase font-medium" style={{ color: '#64748B' }}>{h}</th>)}
        </tr></thead><tbody>
          {clients.map(c => (<tr key={c.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
            <td className="p-4 text-sm font-medium" style={{ color: '#0F172A' }}>{c.name}</td>
            <td className="p-4 text-sm" style={{ color: '#64748B' }}>{c.icon}</td>
            <td className="p-4 text-sm" style={{ color: '#64748B' }}>{c.website || '-'}</td>
            <td className="p-4 text-sm" style={{ color: '#64748B' }}>{c.displayOrder}</td>
            <td className="p-4"><div className="flex gap-2"><button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF', color: '#4A90D9' }}><FontAwesomeIcon icon={faEdit} className="text-xs" /></button><button onClick={() => handleDelete(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2', color: '#EF4444' }}><FontAwesomeIcon icon={faTrash} className="text-xs" /></button></div></td>
          </tr>))}
        </tbody></table>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={editCl ? 'Edit Client' : 'Add Client'}>
        <div className="flex flex-col gap-4">
          <Input label="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Client name" />
          <Select label="Icon" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} options={iconNames} />
          <Input label="Website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://example.com" />
          <Input label="Display Order" type="number" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })} />
          <div className="flex gap-3 justify-end"><BtnSecondary onClick={() => setIsOpen(false)}>Cancel</BtnSecondary><BtnPrimary onClick={handleSave}><FontAwesomeIcon icon={faSave} /> Save</BtnPrimary></div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MEDIA PAGE (Images & Videos)
   ═══════════════════════════════════════════ */
function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [form, setForm] = useState({ name: '', url: '', type: 'image' as 'image' | 'video' });
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => setMedia(getStorage('cms_media', [])), []);
  useEffect(() => { load(); }, [load]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { alert('Max 3MB allowed'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setPreview(result);
      setForm({ ...form, url: result, name: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.url) { alert('Please upload or enter a URL'); return; }
    const all: MediaItem[] = getStorage('cms_media', []);
    const newItem: MediaItem = { id: Date.now().toString(), type: form.type, name: form.name || 'Untitled', url: form.url, createdAt: new Date().toISOString() };
    setStorage('cms_media', [...all, newItem]);
    load(); broadcastUpdate(); setIsOpen(false); setPreview(''); setForm({ name: '', url: '', type: 'image' });
  };

  const handleDelete = (id: string) => { if (confirm('Delete this item?')) { setStorage('cms_media', getStorage('cms_media', []).filter((m: MediaItem) => m.id !== id)); load(); broadcastUpdate(); } };

  const copyUrl = (url: string) => { navigator.clipboard?.writeText(url); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Media Library</h2>
        <BtnPrimary onClick={() => { setIsOpen(true); setPreview(''); setForm({ name: '', url: '', type: 'image' }); }}><FontAwesomeIcon icon={faPlus} /> Add Media</BtnPrimary>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {media.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FontAwesomeIcon icon={faImage} className="text-4xl mb-3" style={{ color: '#CBD5E1' }} />
            <p className="text-sm" style={{ color: '#64748B' }}>No media yet. Click "Add Media" to upload images or videos.</p>
          </div>
        ) : media.map(m => (
          <div key={m.id} className="group relative rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0', background: 'white' }}>
            {m.type === 'video' ? (
              <div className="w-full h-28 flex items-center justify-center" style={{ background: '#0F172A' }}>
                <FontAwesomeIcon icon={faVideo} className="text-2xl" style={{ color: '#EF4444' }} />
              </div>
            ) : (
              <img src={m.url} alt={m.name} className="w-full h-28 object-cover" />
            )}
            <div className="p-2">
              <div className="text-xs font-medium truncate" style={{ color: '#0F172A' }}>{m.name}</div>
              <div className="text-xs" style={{ color: '#94A3B8' }}>{m.type} &middot; {new Date(m.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => copyUrl(m.url)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs" style={{ background: 'rgba(255,255,255,0.2)' }} title="Copy URL"><FontAwesomeIcon icon={faCopy} /></button>
              <button onClick={() => handleDelete(m.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs" style={{ background: 'rgba(239,68,68,0.8)' }} title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Media Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Add Media">
        <div className="flex gap-4 mb-4">
          <button onClick={() => setTab('upload')} className={`text-sm font-medium pb-1 ${tab === 'upload' ? 'border-b-2' : ''}`} style={{ color: tab === 'upload' ? '#4A90D9' : '#94A3B8', borderColor: '#4A90D9' }}>Upload File</button>
          <button onClick={() => setTab('url')} className={`text-sm font-medium pb-1 ${tab === 'url' ? 'border-b-2' : ''}`} style={{ color: tab === 'url' ? '#4A90D9' : '#94A3B8', borderColor: '#4A90D9' }}>External URL</button>
        </div>

        <div className="flex flex-col gap-4">
          {tab === 'upload' ? (
            <>
              <div className="rounded-xl p-6 text-center cursor-pointer" style={{ border: '2px dashed #E2E8F0' }} onClick={() => fileInputRef.current?.click()}>
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} className="text-2xl mb-2" style={{ color: '#94A3B8' }} />
                    <p className="text-sm" style={{ color: '#64748B' }}>Click to upload image or video</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Max 3MB</p>
                  </>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
              </div>
              <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="File name" />
            </>
          ) : (
            <>
              <Input label="URL" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
              <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Media name" />
              <Select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'image' | 'video' })} options={['image', 'video']} />
            </>
          )}
          <div className="flex gap-3 justify-end">
            <BtnSecondary onClick={() => setIsOpen(false)}>Cancel</BtnSecondary>
            <BtnPrimary onClick={handleSave}><FontAwesomeIcon icon={faSave} /> Save</BtnPrimary>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MESSAGES PAGE
   ═══════════════════════════════════════════ */
function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = useCallback(() => setMessages(getStorage('cms_messages', [])), []);
  useEffect(() => { load(); }, [load]);

  const markRead = (id: string) => { const updated = messages.map(m => m.id === id ? { ...m, isRead: true } : m); setStorage('cms_messages', updated); setMessages(updated); };
  const handleDelete = (id: string) => { if (confirm('Delete?')) { const updated = messages.filter(m => m.id !== id); setStorage('cms_messages', updated); setMessages(updated); if (selected?.id === id) setSelected(null); } };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F172A' }}>Messages</h2>
      <div className="rounded-xl overflow-hidden" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
        <table className="w-full"><thead><tr style={{ borderBottom: '1px solid #E2E8F0' }}>
          {['', 'Name', 'Email', 'Service', 'Date', ''].map(h => <th key={h} className="text-left p-4 text-xs uppercase font-medium" style={{ color: '#64748B' }}>{h}</th>)}
        </tr></thead><tbody>
          {messages.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-sm" style={{ color: '#64748B' }}>No messages.</td></tr> : messages.map(m => (
            <tr key={m.id} className={`hover:bg-gray-50 ${!m.isRead ? 'bg-blue-50/30' : ''}`} style={{ borderBottom: '1px solid #E2E8F0' }}>
              <td className="p-4"><div className={`w-2.5 h-2.5 rounded-full ${m.isRead ? 'bg-gray-300' : 'bg-blue-500'}`} /></td>
              <td className="p-4 text-sm font-medium" style={{ color: '#0F172A' }}>{m.name}</td>
              <td className="p-4 text-sm" style={{ color: '#64748B' }}>{m.email}</td>
              <td className="p-4"><span className="px-2 py-0.5 text-xs rounded-full" style={{ background: 'rgba(74,144,217,0.1)', color: '#4A90D9' }}>{m.serviceType}</span></td>
              <td className="p-4 text-sm" style={{ color: '#64748B' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
              <td className="p-4"><div className="flex gap-2"><button onClick={() => { setSelected(m); markRead(m.id); }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF', color: '#4A90D9' }}><FontAwesomeIcon icon={faEye} className="text-xs" /></button>{!m.isRead && <button onClick={() => markRead(m.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F0FDF4', color: '#10B981' }}><FontAwesomeIcon icon={faCheckCircle} className="text-xs" /></button>}<button onClick={() => handleDelete(m.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEF2F2', color: '#EF4444' }}><FontAwesomeIcon icon={faTrash} className="text-xs" /></button></div></td>
            </tr>
          ))}
        </tbody></table>
      </div>
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Message Details">
        {selected && (<div className="flex flex-col gap-3">
          <div><span className="text-xs font-medium uppercase" style={{ color: '#64748B' }}>From</span><p className="text-sm font-medium" style={{ color: '#0F172A' }}>{selected.name} &lt;{selected.email}&gt;</p></div>
          <div><span className="text-xs font-medium uppercase" style={{ color: '#64748B' }}>Service</span><p className="text-sm" style={{ color: '#0F172A' }}>{selected.serviceType}</p></div>
          <div><span className="text-xs font-medium uppercase" style={{ color: '#64748B' }}>Message</span><p className="text-sm p-3 rounded-lg mt-1" style={{ background: '#F8FAFC', color: '#0F172A' }}>{selected.message}</p></div>
          <div className="flex gap-3 justify-end pt-2"><a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: '#4A90D9' }}><FontAwesomeIcon icon={faEnvelope} /> Reply</a><BtnSecondary onClick={() => setSelected(null)}>Close</BtnSecondary></div>
        </div>)}
      </Modal>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SETTINGS PAGE (with Owner Photo)
   ═══════════════════════════════════════════ */
function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(getStorage('cms_settings', {} as SiteSettings));
  const [saved, setSaved] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => { setStorage('cms_settings', settings); broadcastUpdate(); setSaved(true); setTimeout(() => setSaved(false), 3000); };
  const update = (field: keyof SiteSettings, value: string) => setSettings(prev => ({ ...prev, [field]: value }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Max 2MB for profile photo'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { const result = ev.target?.result as string; update('ownerPhoto', result); };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F172A' }}>Site Settings</h2>

      {/* Owner Photo Section */}
      <Card className="mb-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#0F172A' }}>Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <img src={settings.ownerPhoto || './assets/owner-photo.jpg'} alt="Owner" className="w-24 h-24 rounded-xl object-cover" style={{ border: '2px solid #E2E8F0' }} />
            <button onClick={() => photoInputRef.current?.click()} className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ background: '#4A90D9' }}>
              <FontAwesomeIcon icon={faCamera} />
            </button>
            <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#0F172A' }}>Change your profile photo</p>
            <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>Recommended: 400x400px, max 2MB</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => photoInputRef.current?.click()} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#EFF6FF', color: '#4A90D9' }}><FontAwesomeIcon icon={faUpload} /> Upload</button>
              <button onClick={() => update('ownerPhoto', './assets/owner-photo.jpg')} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: '#F1F5F9', color: '#64748B' }}>Reset</button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#0F172A' }}>Owner Info</h3>
          <div className="flex flex-col gap-4">
            <Input label="Name" value={settings.ownerName || ''} onChange={e => update('ownerName', e.target.value)} />
            <Input label="Tagline" value={settings.tagline || ''} onChange={e => update('tagline', e.target.value)} />
            <Textarea label="About Text" value={settings.aboutText || ''} onChange={e => update('aboutText', e.target.value)} rows={4} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#0F172A' }}>Contact Info</h3>
          <div className="flex flex-col gap-4">
            <Input label="Email" value={settings.email || ''} onChange={e => update('email', e.target.value)} />
            <Input label="Phone" value={settings.phone || ''} onChange={e => update('phone', e.target.value)} />
            <Input label="Location" value={settings.location || ''} onChange={e => update('location', e.target.value)} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#0F172A' }}>Social Links</h3>
          <div className="flex flex-col gap-4">
            <Input label="Behance" value={settings.behance || ''} onChange={e => update('behance', e.target.value)} />
            <Input label="LinkedIn" value={settings.linkedin || ''} onChange={e => update('linkedin', e.target.value)} />
            <Input label="Instagram" value={settings.instagram || ''} onChange={e => update('instagram', e.target.value)} />
            <Input label="Facebook" value={settings.facebook || ''} onChange={e => update('facebook', e.target.value)} />
            <Input label="WhatsApp" value={settings.whatsapp || ''} onChange={e => update('whatsapp', e.target.value)} />
          </div>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#0F172A' }}>SEO</h3>
          <div className="flex flex-col gap-4">
            <Input label="Meta Title" value={settings.metaTitle || ''} onChange={e => update('metaTitle', e.target.value)} />
            <Textarea label="Meta Description" value={settings.metaDescription || ''} onChange={e => update('metaDescription', e.target.value)} rows={3} />
          </div>
        </Card>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <BtnPrimary onClick={handleSave}><FontAwesomeIcon icon={faSave} /> Save Settings</BtnPrimary>
        {saved && <span className="text-sm font-medium" style={{ color: '#10B981' }}><FontAwesomeIcon icon={faCheckCircle} /> Saved!</span>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   APPEARANCE PAGE
   ═══════════════════════════════════════════ */
function AppearancePage() {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  const [saved, setSaved] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('theme', 'dark'); }
    else { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('theme', 'light'); }
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#0F172A' }}>Appearance</h2>
      <Card className="max-w-md">
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#0F172A' }}>Theme</h3>
        <div className="flex items-center justify-between p-4 rounded-lg" style={{ background: '#F8FAFC' }}>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={theme === 'dark' ? faMoon : faSun} style={{ color: '#4A90D9' }} />
            <div>
              <div className="text-sm font-medium" style={{ color: '#0F172A' }}>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
              <div className="text-xs" style={{ color: '#64748B' }}>Current theme</div>
            </div>
          </div>
          <button onClick={toggleTheme} className="relative w-12 h-6 rounded-full transition-colors" style={{ background: theme === 'dark' ? '#4A90D9' : '#CBD5E1' }}>
            <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform" style={{ transform: theme === 'dark' ? 'translateX(26px)' : 'translateX(2px)' }} />
          </button>
        </div>
        {saved && <p className="text-sm mt-3" style={{ color: '#10B981' }}><FontAwesomeIcon icon={faCheckCircle} /> Theme updated!</p>}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN DASHBOARD LAYOUT
   ═══════════════════════════════════════════ */
export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => { initStorage(); const isAuth = localStorage.getItem('admin_auth'); if (!isAuth) navigate('/dashboard/login'); }, [navigate]);

  const activePath = (() => {
    const rest = location.pathname.replace(/^\/dashboard\/?/, '');
    if (rest.startsWith('projects')) return 'projects';
    if (rest.startsWith('categories')) return 'categories';
    if (rest.startsWith('clients')) return 'clients';
    if (rest.startsWith('media')) return 'media';
    if (rest.startsWith('appearance')) return 'appearance';
    if (rest.startsWith('settings')) return 'settings';
    if (rest.startsWith('messages')) return 'messages';
    return '';
  })();

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth < 768) { setSidebarOpen(false); setSidebarCollapsed(false); } else if (window.innerWidth < 1024) setSidebarCollapsed(true); else setSidebarCollapsed(false); };
    handleResize(); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => { localStorage.removeItem('admin_auth'); navigate('/dashboard/login'); };
  const goTo = (path: string) => { navigate(`/dashboard/${path}`); if (window.innerWidth < 768) setSidebarOpen(false); };
  const sidebarWidth = sidebarCollapsed ? '72px' : '260px';
  const pageTitle = navItems.find(n => n.path === activePath)?.label || 'Overview';

  return (
    <div className="flex h-screen" style={{ background: '#F8FAFC' }}>
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className="fixed md:relative z-50 h-full flex flex-col transition-all duration-300" style={{ width: sidebarWidth, background: '#0D1B2A', left: sidebarOpen || window.innerWidth >= 768 ? 0 : '-260px' }}>
        <div className="h-16 flex items-center px-4 gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: '#4A90D9' }}>M</div>
          {!sidebarCollapsed && <span className="font-semibold text-white text-sm truncate">Portfolio CMS</span>}
        </div>
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.path} onClick={() => goTo(item.path)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left" style={{ background: activePath === item.path ? 'rgba(74,144,217,0.2)' : 'transparent', color: activePath === item.path ? '#F0F8FF' : '#94A3B8', borderLeft: activePath === item.path ? '3px solid #4A90D9' : '3px solid transparent' }} title={sidebarCollapsed ? item.label : undefined}>
              <FontAwesomeIcon icon={item.icon} className="text-sm w-5 text-center flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left" style={{ color: '#94A3B8' }} title={sidebarCollapsed ? 'Logout' : undefined}>
            <FontAwesomeIcon icon={faRightFromBracket} className="text-sm w-5 text-center flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 flex items-center justify-between px-4 flex-shrink-0" style={{ background: 'white', borderBottom: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#F1F5F9' }}><FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} className="text-sm" /></button>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden md:flex w-9 h-9 rounded-lg items-center justify-center" style={{ background: '#F1F5F9' }}><FontAwesomeIcon icon={faBars} className="text-sm" /></button>
            <h1 className="font-semibold text-sm" style={{ color: '#0F172A' }}>{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: '#4A90D9' }}>M</div>
            <span className="hidden sm:inline text-xs font-medium" style={{ color: '#0F172A' }}>Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="" element={<OverviewPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/new" element={<ProjectFormPage />} />
            <Route path="projects/edit/:id" element={<ProjectFormPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="appearance" element={<AppearancePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="messages" element={<MessagesPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
