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

export const ProfileOrders: FC<BackgroundProps> = ({
  wallpaper
}: BackgroundProps) => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectUserOrders);
  const ingredients = useAppSelector(selectIngredients);

  useEffect(() => {
    console.log('fetch orders and ingredients', orders);
    dispatch(fetchUserOrders());
    dispatch(fetchIngredients());
  }, []);

  if (!orders || !ingredients) {
    return wallpaper ? null : <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} ingredients={ingredients} />;
};
