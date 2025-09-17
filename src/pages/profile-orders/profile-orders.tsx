import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { Preloader } from '@ui';
import { fetchUserOrders, selectUserOrders } from '../../slices/userSlice';
import {
  fetchIngredients,
  selectIngredients
} from '../../slices/ingredientsSlice';
import { BackgroundProps } from './../../components/protected-route/type';
import { useParams, useLocation } from 'react-router-dom';
import { OrderInfo } from '../../components/order-info/order-info';

export const ProfileOrders: FC<BackgroundProps> = ({
  wallpaper
}: BackgroundProps) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchUserOrders());
    dispatch(fetchIngredients());
  }, []);

  const orders = useAppSelector(selectUserOrders);
  const ingredients = useAppSelector(selectIngredients);

  if (params.number && !background) {
    return <OrderInfo />;
  }

  if (!orders || !ingredients) {
    return wallpaper ? null : <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} ingredients={ingredients} />;
};
