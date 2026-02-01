import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Accounts from '../pages/Accounts';
import Manage from '../pages/Manage';
import HowItWorks from '../pages/HowItWorks';
import Transparency from '../pages/Transparency';
import Settings from '../pages/Settings';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={<Navigate to="/accounts" replace />}
        />
        <Route
          path="/accounts"
          element={
            <PageTransition>
              <Accounts />
            </PageTransition>
          }
        />
        <Route
          path="/manage"
          element={
            <PageTransition>
              <Manage />
            </PageTransition>
          }
        />
        <Route
          path="/transparency"
          element={
            <PageTransition>
              <Transparency />
            </PageTransition>
          }
        />
        <Route
          path="/settings"

          element={
            <PageTransition>
              <Settings />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
