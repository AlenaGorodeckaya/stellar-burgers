import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { useLocation, NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `text text_type_main-default ml-2 mr-10 ${
                styles.link
              } ${isActive ? styles.link_active : ''}`
            }
            end
          >
            <BurgerIcon
              type={location.pathname === '/' ? 'primary' : 'secondary'}
            />
            Конструктор
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `text text_type_main-default ml-2 ${
                styles.link
              } ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon
              type={
                location.pathname.startsWith('/feed') ? 'primary' : 'secondary'
              }
            />
            Лента заказов
          </NavLink>
        </div>
        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className='' />
          </NavLink>
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `text text_type_main-default ml-2 ${styles.link} ${
                isActive || location.pathname.startsWith('/profile/orders')
                  ? styles.link_active
                  : ''
              }`
            }
          >
            <ProfileIcon
              type={
                location.pathname.startsWith('/profile')
                  ? 'primary'
                  : 'secondary'
              }
            />
            {userName || 'Личный кабинет'}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

//Готово?
