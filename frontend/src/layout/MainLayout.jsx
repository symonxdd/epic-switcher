import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import styles from './MainLayout.module.css';
import { Toaster } from 'react-hot-toast';

function MainLayout({ children }) {
  return (
    <div className={styles.appContainer}>
      <TopBar />
      <div className={styles.mainLayout}>
        <Sidebar />
        <main className={styles.content}>
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
            color: 'var(--text-inverse)',
            borderRadius: '6px',
            padding: '10px 14px',
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
            maxWidth: 'none',
          },
        }}
      // limit={3}
      />
    </div>
  );
}

export default MainLayout;
