import styles from './BaseLayout.module.css';
// Импорт компонента шапки приложения
import { AppHeader } from '@components';
import { Outlet } from 'react-router-dom';

export default function BaseLayout() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Outlet />
    </div>
  );
}

// готово
