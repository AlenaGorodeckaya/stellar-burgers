import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/createSlice/userReducer';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, requestState, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (requestState === 'loading') {
    return <Preloader />;
  }

  if (requestState === 'failed') {
    return <div>Ошибка загрузки заказов: {error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
