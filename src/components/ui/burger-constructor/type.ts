import { TOrder, TIngredient } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: (TIngredient & { id?: string }) | null;
    ingredients: (TIngredient & { id: string })[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
