import styles from './PageHeader.module.css';

function PageHeader({ title, rightElement }) {
  return (
    <header className={styles.pageHeader}>
      <h1 className={styles.pageHeaderTitle}>{title}</h1>
      {rightElement && <div className={styles.pageHeaderRight}>{rightElement}</div>}
    </header>
  );
}

export default PageHeader;
