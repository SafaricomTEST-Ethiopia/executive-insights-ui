import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cvm from './pages/Cvm';
import Esb from './pages/Esb';
import Login from './pages/Login';
import InitiativeIntake from './pages/InitiativeIntake';
import { useAuth } from './hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/intake" element={<InitiativeIntake />} />
                  <Route path="/cvm" element={<Cvm />} />
                  <Route path="/esb" element={<Esb />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
