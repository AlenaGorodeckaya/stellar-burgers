import { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchUserData,
  selectIsUserLoading,
  selectIsAuthenticated
} from '../../slices/userSlice';

import { Navigate, useLocation } from 'react-router';
import { Preloader } from '@ui';

import { ProtectedRouteProps, BackgroundProps } from './type';

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
  wallpaper = false
}: ProtectedRouteProps & BackgroundProps) => {
  const dispatch = useAppDispatch();
  const location = useLocation();

  // Селекторы состояния авторизации
  const isCheckingAuth = useAppSelector(selectIsUserLoading);
  const isUserAuthenticated = useAppSelector(selectIsAuthenticated);

  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  // Перенаправление для маршрутов, доступных только неавторизованным
  if (onlyUnAuth && isUserAuthenticated) {
    const targetPath = location.state?.from?.pathname || '/';
    return <Navigate to={targetPath} replace />;
  }

  // Перенаправление для защищенных маршрутов при отсутствии авторизации
  if (!onlyUnAuth && !isUserAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Отображение прелоадера во время проверки авторизации
  if (isCheckingAuth) {
    return wallpaper ? null : <Preloader />;
  }

  // Отображение дочерних элементов при успешной проверке
  return <>{children}</>;
};

// Вспомогательная функция для создания защищенных маршрутов
export const withProtection = (
  element: ReactElement,
  { onlyUnAuth, wallpaper }: ProtectedRouteOptions = {}
) => (
  <ProtectedRoute onlyUnAuth={onlyUnAuth} wallpaper={wallpaper}>
    {element}
  </ProtectedRoute>
);

export interface ProtectedRouteOptions {
  onlyUnAuth?: boolean;
  wallpaper?: boolean;
}
