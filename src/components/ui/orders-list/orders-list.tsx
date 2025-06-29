import { FC } from 'react';

import styles from './orders-list.module.css';

import { OrdersListUIProps } from './type';
import { OrderCard } from '@components';

export const OrdersListUI: FC<OrdersListUIProps> = ({
  orderByDate,
  listType
}) => (
  <div
    className={`${styles.content} ${listType === 'feed' ? styles.feed : styles.profile}`}
  >
    {orderByDate.map((order) => (
      <OrderCard order={order} key={order._id} listType={listType} />
    ))}
  </div>
);
