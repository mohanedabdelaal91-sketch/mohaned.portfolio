import { Routes, Route } from 'react-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { LenisProvider } from '@/context/LenisContext';
import Home from '@/pages/Home';
import ProjectDetail from '@/pages/ProjectDetail';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';

export default function App() {
  return (
    <ThemeProvider>
      <LenisProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/dashboard/login" element={<Login />} />
        </Routes>
      </LenisProvider>
    </ThemeProvider>
  );
}
