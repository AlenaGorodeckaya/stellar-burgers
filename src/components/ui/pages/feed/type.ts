import { TOrder, TIngredient } from '@utils-types';

export type FeedUIProps = {
  orders: TOrder[];
  handleGetFeeds: () => void;
  ingredients: TIngredient[];
};
