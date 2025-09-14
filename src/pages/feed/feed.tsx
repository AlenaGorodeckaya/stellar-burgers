import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { BackgroundProps } from './../../components/protected-route/type';
import { FC, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { OrderInfo } from '../../components/order-info/order-info';

import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchFeeds,
  selectFeedLoading,
  selectFeedOrders
} from '../../slices/feedSlice';
import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading
} from '../../slices/ingredientsSlice';

export const Feed: FC<BackgroundProps> = ({ wallpaper }: BackgroundProps) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchFeeds());
    dispatch(fetchIngredients());
  }, []);

  const orders = useAppSelector(selectFeedOrders);
  const isFeedsLoading = useAppSelector(selectFeedLoading);

  const ingredients = useAppSelector(selectIngredients);
  const isIngredientsLoading = useAppSelector(selectIngredientsLoading);

  // При прямом переходе к заказу показываем OrderInfo
  if (params.number && !background) {
    return <OrderInfo />;
  }

  if (!orders || !ingredients || isFeedsLoading || isIngredientsLoading) {
    return wallpaper ? null : <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      ingredients={ingredients}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
