import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { useProjects, useCategories } from '@/hooks/useSharedData';
import { useTilt } from '@/hooks/useTilt';

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({
  project,
  onQuickView,
}: {
  project: any;
  onQuickView: (p: any) => void;
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useTilt({ max: 8 });
  const navigate = useNavigate();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer"
      style={{ transition: 'transform 0.1s ease-out' }}
      onClick={() => navigate(`/project/${project.slug}`)}
    >
      <div
        className="overflow-hidden rounded-xl"
        style={{
          background: 'var(--color-card-bg)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <img
            src={project.thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Quick view overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ background: 'var(--color-overlay)' }}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(project);
            }}
          >
            <span className="btn-primary text-sm">
              <FontAwesomeIcon icon={faEye} className="mr-2" />
              Quick View
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            {project.categories.map((cat: string) => (
              <span
                key={cat}
                className="px-2.5 py-0.5 text-xs font-medium rounded-full"
                style={{
                  background: 'rgba(74, 144, 217, 0.15)',
                  color: 'var(--color-accent-primary)',
                }}
              >
                {cat}
              </span>
            ))}
          </div>
          <h3
            className="text-lg font-semibold"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text-primary)',
            }}
          >
            {project.title}
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            Client: {project.client}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function QuickViewModal({
  project,
  onClose,
}: {
  project: any;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'var(--color-overlay)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{
                background: 'var(--color-card-bg)',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
              }}
            >
              &times;
            </button>

            {/* Image */}
            <div style={{ aspectRatio: '16/9' }}>
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover rounded-t-2xl"
              />
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {project.categories.map((cat: string) => (
                  <span
                    key={cat}
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{
                      background: 'rgba(74, 144, 217, 0.15)',
                      color: 'var(--color-accent-primary)',
                    }}
                  >
                    {cat}
                  </span>
                ))}
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {project.year}
                </span>
              </div>

              <h2
                className="text-2xl font-bold mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {project.title}
              </h2>

              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Client: <span className="font-medium">{project.client}</span>
              </p>

              <p
                className="mb-6"
                style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
              >
                {project.shortDescription}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tools.map((tool: string) => (
                  <span
                    key={tool}
                    className="px-3 py-1 text-xs rounded-md"
                    style={{
                      background: 'var(--color-card-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate(`/project/${project.slug}`);
                }}
                className="btn-primary"
              >
                View Full Details
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Projects() {
  const projects = useProjects();
  const categories = useCategories();
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [quickViewProject, setQuickViewProject] = useState<typeof projects[0] | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const filterTabs = ['All', ...categories.map((c: { name: string }) => c.name)];

  const projectsList = Array.isArray(projects) ? projects : [];
  const filteredProjects =
    activeFilter === 'All'
      ? projectsList
      : projectsList.filter((p: any) => p.categories?.includes(activeFilter) || p.category === activeFilter);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

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
    setVisibleCount(6);
  }, [activeFilter]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full py-24"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <div className="section-container">
        {/* Title */}
        <div ref={titleRef} className="mb-12">
          <span
            className="text-xs uppercase tracking-[0.15em] font-semibold"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            Portfolio
          </span>
          <h2 className="section-title mt-2">
            My <span className="accent">Work</span>
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
              style={{
                background: activeFilter === tab ? 'var(--color-accent-primary)' : 'transparent',
                color: activeFilter === tab ? 'white' : 'var(--color-text-secondary)',
                border:
                  activeFilter === tab
                    ? '1px solid transparent'
                    : '1px solid var(--color-border)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onQuickView={setQuickViewProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More */}
        {visibleCount < filteredProjects.length && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 3)}
              className="btn-secondary"
            >
              Load More Projects
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        project={quickViewProject}
        onClose={() => setQuickViewProject(null)}
      />
    </section>
  );
}
