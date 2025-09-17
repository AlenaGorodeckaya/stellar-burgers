import React, { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

// Функция для получения классов навигационной ссылки
const getNavLinkClasses = ({ isActive }: { isActive: boolean }): string => {
  const baseClass = styles.link;
  const activeClass = isActive ? styles.link_active : '';

  return [baseClass, activeClass].filter(Boolean).join(' ');
};

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header} role='banner'>
    <nav className={`${styles.menu} p-4`} aria-label='Основная навигация'>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={getNavLinkClasses}
          end
          aria-label='Перейти к конструктору бургеров'
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to='/feed'
          className={getNavLinkClasses}
          aria-label='Перейти к ленте заказов'
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='text text_type_main-default ml-2'>
                Лента заказов
              </span>
            </>
          )}
        </NavLink>
      </div>

      <div className={styles.logo}>
        <Link to='/' aria-label='Перейти на главную страницу'>
          <Logo className='' />
        </Link>
      </div>

      <div className={styles.link_position_last}>
        <NavLink
          to='/profile'
          className={getNavLinkClasses}
          aria-label='Перейти в личный кабинет'
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <span className='text text_type_main-default ml-2'>
                {userName || 'Личный кабинет'}
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
