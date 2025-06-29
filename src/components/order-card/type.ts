import { TOrder } from '@utils-types';

export type OrderCardProps = {
  order: TOrder;
  listType?: 'feed' | 'profile-orders'; // тип списка feed - лента, profile-orders - история заказов
};
