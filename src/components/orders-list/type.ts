import { TOrder } from '@utils-types';

export type OrdersListProps = {
  orders: TOrder[];
  listType: 'feed' | 'profile-orders'; // тип списка feed - лента, profile-orders - история заказов
};
