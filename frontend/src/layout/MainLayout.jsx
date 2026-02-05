import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import styles from './MainLayout.module.css';
import { Toaster } from 'react-hot-toast';

import TopNav from '../components/TopNav';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { SupportCoffee } from '../components/SupportCoffee';
import HintMessage from '../components/HintMessage';

function MainLayout({ children }) {
  const { pathname } = useLocation();
  const contentRef = useRef(null);
  const [layoutMode, setLayoutMode] = useState('sidebar');

  useEffect(() => {
    const handleSync = () => {
      const mode = localStorage.getItem(STORAGE_KEYS.LAYOUT_MODE) || 'sidebar';
      setLayoutMode(mode);
    };

    handleSync();
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  const isTopNav = layoutMode === 'top-nav';

  return (
    <div className={styles.appContainer}>
      <TopBar className={isTopNav ? styles.topBarTopNav : ''} />

      {/* TopNav rendered conditionally, but could also be hidden via CSS if strictly needed. 
          Given it's lightweight, conditional is okay, but user wanted strict no-lag for SIDEBAR. 
          The Sidebar is the heavy one. */}
      {isTopNav && <TopNav />}

      <div className={styles.mainLayout}>
        {/* CRITICAL: Keep Sidebar mounted ALWAYS to prevent re-mount lag/animation replay */}
        <Sidebar style={{ display: isTopNav ? 'none' : 'flex' }} />

        <main
          id="main-content"
          data-layout={layoutMode}
          className={isTopNav ? styles.contentTopNav : styles.content}
          ref={contentRef}
        >
          {isTopNav ? (
            <div className={styles.contentWrapper}>
              {children}
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      <AnimatePresence>
        {(pathname === '/accounts' || pathname === '/manage') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: isTopNav ? '0' : '230px', // Offset for sidebar width
              right: '0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          >
            <div style={{ pointerEvents: 'auto' }}>
              <HintMessage />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isTopNav && pathname !== '/transparency' && (
        <div className={styles.floatingCoffee}>
          <SupportCoffee />
        </div>
      )}

      {/* Global toast container */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: 'var(--bg-toast)',
            color: 'var(--text-primary)',
            borderRadius: '16px',
            padding: '10px 14px',
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
            maxWidth: 'none',
            border: '1px solid var(--border-subtle)'
          },
        }}
      // limit={3}
      />
    </div>
  );
}

export default MainLayout;
