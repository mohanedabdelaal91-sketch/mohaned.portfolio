import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useProjects } from '@/hooks/useSharedData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const projects = useProjects();
  const projectsList = Array.isArray(projects) ? projects : [];

  const project = projectsList.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Project Not Found</h1>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Portfolio
          </button>
        </div>
      </div>
    );
  }

  const relatedProjects = projectsList
    .filter((p) => p.id !== project.id && p.categories?.some((c) => project.categories?.includes(c)))
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      <Navbar />
      <ScrollProgress />

      {/* Back Button */}
      <div className="section-container pt-24 pb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Portfolio
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full" style={{ height: '50vh' }}>
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 50%, var(--color-bg-primary))',
          }}
        />
      </div>

      {/* Content */}
      <div className="section-container -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div
              className="p-6 rounded-xl sticky top-24"
              style={{
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 text-sm font-medium rounded-full"
                    style={{
                      background: 'var(--color-accent-primary)',
                      color: 'white',
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                    Client
                  </span>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {project.client}
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                    Year
                  </span>
                  <p className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    {project.year}
                  </p>
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)' }}>
                    Tools Used
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-1 text-xs rounded-md"
                        style={{
                          background: 'var(--color-bg-primary)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="btn-primary w-full mt-4">
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                  View Live Project
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <h1
              className="text-4xl font-bold mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)',
              }}
            >
              {project.title}
            </h1>

            <div
              className="prose max-w-none mb-10"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}
            >
              {project.fullDescription.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>

            {/* Gallery */}
            <h3
              className="text-xl font-semibold mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)',
              }}
            >
              Project Gallery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {project.images.map((img, i) => (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                >
                  <img
                    src={img}
                    alt={`${project.title} - Image ${i + 1}`}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-16 pb-24">
            <h3
              className="text-2xl font-bold mb-8"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text-primary)',
              }}
            >
              Related <span style={{ color: 'var(--color-accent-primary)' }}>Work</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rp) => (
                <div
                  key={rp.id}
                  className="cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: 'var(--color-card-bg)',
                    border: '1px solid var(--color-border)',
                  }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    navigate(`/project/${rp.slug}`);
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(74, 144, 217, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div style={{ aspectRatio: '16/10' }}>
                    <img src={rp.thumbnailUrl} alt={rp.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <h4
                      className="font-semibold"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {rp.title}
                    </h4>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                      {rp.client}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </motion.div>
  );
}
