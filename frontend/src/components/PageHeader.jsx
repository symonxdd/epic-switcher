import styles from './PageHeader.module.css';

function PageHeader({ title }) {
  return (
    <header className={styles.pageHeader}>
      <h1 className={styles.pageHeaderTitle}>{title}</h1>
    </header>
  );
}

export default PageHeader;
