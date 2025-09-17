import { FC, useMemo, useEffect, useState } from 'react';
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
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const authorithed = useAppSelector(selectIsAuthenticated);
  const orderConfirm = useAppSelector(selectOrderConfirmed);
  const orderRequest = useAppSelector(selectOrderRequested);
  const orderModalData = useAppSelector(selectOrderCompleted);
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);

  const constructorItems = { bun, ingredients };

  useEffect(() => {
    if (orderConfirm && !authorithed) {
      dispatch(clearOrder()); // Сбрасываем состояние заказа
      navigate('/login');
      return;
    }

    if (orderConfirm && authorithed && bun && !isOrderProcessing) {
      setIsOrderProcessing(true);
      const ingredientIds = ingredients.map(
        (value: TConstructorIngredient) => value._id
      );
      ingredientIds.unshift(bun._id);
      ingredientIds.push(bun._id);
      dispatch(performOrder(ingredientIds));
    }
  }, [
    orderConfirm,
    authorithed,
    bun,
    ingredients,
    dispatch,
    navigate,
    isOrderProcessing
  ]);

  const onOrderClick = () => {
    if (!bun || orderRequest || isOrderProcessing) return;
    dispatch(confirmOrder());
  };

  const closeOrderModal = () => {
    if (!orderRequest && orderModalData) {
      setIsOrderProcessing(false);
      dispatch(clearConstructor());
      dispatch(clearOrder());
    }
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
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
