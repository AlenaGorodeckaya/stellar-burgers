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

  const isCheckingAuth = useAppSelector(selectIsUserLoading);
  const isUserAuthenticated = useAppSelector(selectIsAuthenticated);
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    // Запрашиваем данные пользователя только при наличии refreshToken
    if (refreshToken) {
      dispatch(fetchUserData());
    }
  }, [dispatch, refreshToken]);

  // Перенаправление для маршрутов, доступных только неавторизованным
  if (onlyUnAuth && isUserAuthenticated) {
    const targetPath = location.state?.from?.pathname || '/';
    return <Navigate to={targetPath} replace />;
  }

  // Перенаправление для защищенных маршрутов при отсутствии авторизации и refreshToken
  if (!onlyUnAuth && !refreshToken) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Отображение прелоадера во время проверки авторизации
  if (isCheckingAuth) {
    return wallpaper ? null : <Preloader />;
  }

  // Для маршрутов только для неавторизованных
  if (onlyUnAuth && !isUserAuthenticated) {
    return children;
  }

  // Для защищенных маршрутов
  if (!onlyUnAuth && isUserAuthenticated) {
    return children;
  }

  return wallpaper ? null : <Preloader />;
};

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
