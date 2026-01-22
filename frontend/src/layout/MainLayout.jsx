import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import styles from './MainLayout.module.css';
import { Toaster } from 'react-hot-toast';

function MainLayout({ children }) {
  const { pathname } = useLocation();
  const contentRef = useRef(null);

  return (
    <div className={styles.appContainer}>
      <TopBar />
      <div className={styles.mainLayout}>
        <Sidebar />
        <main id="main-content" className={styles.content} ref={contentRef}>
          {children}
        </main>
      </div>

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
