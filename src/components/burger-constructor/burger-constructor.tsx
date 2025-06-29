import { FC, useMemo } from 'react';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '../ui/burger-constructor';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  createOrder,
  resetOrder,
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData
} from '../../services/createSlice/constructorReducer';
import { checkUserAuth } from '../../services/createSlice/authReducer';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Селекторы
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const rawConstructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  // Преобразуем данные для соответствия типам
  const constructorItems = {
    bun: rawConstructorItems.bun ? { ...rawConstructorItems.bun } : null,
    ingredients: rawConstructorItems.ingredients.map((ing) => ({
      ...ing,
      id: ing.id || `${ing._id}-${Math.random().toString(36).substr(2, 9)}`
    }))
  };
  // Общая стоимость вкуснейшего бургера
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  // Обработчик клика по кнопке оформления заказа
  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;

    await dispatch(checkUserAuth());

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Массив ID ингредиентов для заказа
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const closeOrderModal = () => {
    dispatch(resetOrder());
  };

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

//Готово
