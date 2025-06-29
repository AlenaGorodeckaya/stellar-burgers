import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { logoutUser } from '../../services/createSlice/authReducer';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutUser()).unwrap();

      // Если выход успешен и пользователь не авторизован
      if (result.success && !isAuthenticated) {
        // Перенаправляем на страницу входа
        navigate('/login', { replace: true });
      }
    } catch (error) {}
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

// готово
