import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Accounts from './pages/Accounts';
import Manage from './pages/Manage';
import HowItWorks from './pages/HowItWorks';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/accounts" replace />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
