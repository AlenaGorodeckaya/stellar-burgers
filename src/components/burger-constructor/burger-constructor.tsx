import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import {
  selectConstructorBun,
  selectConstructorIngredients,
  clearConstructor
} from '../../slices/constructorSlice';
import {
  performOrder,
  selectOrderConfirmed,
  selectOrderRequested,
  selectOrderCompleted,
  confirmOrder,
  clearOrder
} from '../../slices/orderSlice';
import { selectIsAuthenticated } from '../../slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const constructorItems = {
    bun: useAppSelector(selectConstructorBun),
    ingredients: useAppSelector(selectConstructorIngredients)
  };
  const authorithed = useAppSelector(selectIsAuthenticated);
  const orderConfirm = useAppSelector(selectOrderConfirmed);
  const orderRequest = useAppSelector(selectOrderRequested);
  const orderModalData = useAppSelector(selectOrderCompleted);

  if (orderConfirm && !authorithed) {
    navigate('/login');
  }

  if (orderConfirm && authorithed && constructorItems.bun) {
    const ingredients = constructorItems.ingredients.map(
      (value: TConstructorIngredient) => value._id
    );
    ingredients.unshift(constructorItems.bun._id);
    ingredients.push(constructorItems.bun._id);
    dispatch(performOrder(ingredients));
  }

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    dispatch(confirmOrder());
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      (constructorItems.ingredients?.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ) || 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
