import { FC } from 'react';
import { TOrder } from '@utils-types';

import { FeedInfoUI } from '../ui/feed-info';

import { useAppSelector } from '../../services/store';

import {
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedOrders
} from '../../slices/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useAppSelector(selectFeedOrders) || [];
  const feed = {
    total: useAppSelector(selectFeedTotal),
    totalToday: useAppSelector(selectFeedTotalToday)
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
