import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ADMIN_EMAIL = 'mohanedabdelaal91@gmail.com';
const ADMIN_PASSWORD = 'M#A312206';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_auth', 'true');
        localStorage.setItem('admin_email', ADMIN_EMAIL);
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 600);
  };

  const inputStyle = {
    background: 'var(--color-bg-primary)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    padding: '0.75rem 1rem 0.75rem 2.75rem',
    color: 'var(--color-text-primary)',
    width: '100%',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-gradient-end) 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div
          className="p-8 rounded-2xl"
          style={{
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          }}
        >
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
            >
              Portfolio <span style={{ color: 'var(--color-accent-primary)' }}>CMS</span>
            </h1>
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Sign in to manage your portfolio
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-secondary)' }}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
                }}
                required
              />
            </div>

            <div className="relative">
              <FontAwesomeIcon
                icon={faLock}
                className="absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-secondary)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: error ? 'var(--color-error)' : 'var(--color-border)',
                  paddingRight: '2.75rem',
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {error && (
              <p className="text-sm" style={{ color: 'var(--color-error)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p
            className="text-center text-xs mt-6"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Default: {ADMIN_EMAIL}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
