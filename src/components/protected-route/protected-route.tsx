import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkUserAuth } from '../../services/createSlice/authReducer';
import type { AppDispatch } from '../../services/store';

type ProtectedRouteProps = {
  onlyForGuests?: boolean;
  children: React.ReactElement;
  showLoader?: boolean;
  checkAuth?: boolean;
  redirectTo?: string;
};

export const ProtectedRoute = ({
  onlyForGuests = false,
  children,
  showLoader = true,
  checkAuth = true,
  redirectTo = '/'
}: ProtectedRouteProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const { isAuthCheckComplete, isAuthenticated, isAuthInProgress } =
    useSelector((state) => state.auth);

  // Проверка авторизации
  useEffect(() => {
    if (checkAuth && !isAuthCheckComplete) {
      dispatch(checkUserAuth());
    }
  }, [checkAuth, dispatch, isAuthCheckComplete]);

  // Показ прелоадера во время проверки
  if (checkAuth && (!isAuthCheckComplete || isAuthInProgress)) {
    return showLoader ? <Preloader /> : null;
  }

  // Логика перенаправлений
  if (isAuthenticated) {
    // Для авторизованных на маршрутах только для гостей
    if (onlyForGuests) {
      const returnPath = location.state?.from || redirectTo;
      return <Navigate to={returnPath} replace />;
    }

    // Автоматический редирект с login-страницы
    if (location.pathname === '/login') {
      const returnPath = location.state?.from?.pathname || redirectTo;
      return <Navigate to={returnPath} replace />;
    }
  } else {
    // Для неавторизованных на защищенных маршрутах
    if (!onlyForGuests) {
      return <Navigate to='/login' state={{ from: location }} replace />;
    }
  }

  return children;
};

// готово?
