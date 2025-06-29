import { FC, memo, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

import { useSelector } from '../../services/store';

const maxIngredients = 6;

const getOrderPath = (listType: string, orderNumber: number) =>
  `/${listType}/${orderNumber}`;

export const OrderCard: FC<OrderCardProps> = memo(
  ({ order, listType = 'feed' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    /** TODO: взять переменную из стора */
    const ingredients = useSelector((state) => state.ingredients.items);

    const orderInfo = useMemo(() => {
      if (!ingredients.length) return null;

      const ingredientsInfo = order.ingredients.reduce(
        (acc: TIngredient[], item: string) => {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) return [...acc, ingredient];
          return acc;
        },
        []
      );

      const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

      const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

      const remains =
        ingredientsInfo.length > maxIngredients
          ? ingredientsInfo.length - maxIngredients
          : 0;

      const date = new Date(order.createdAt);
      return {
        ...order,
        ingredientsInfo,
        ingredientsToShow,
        remains,
        total,
        date
      };
    }, [order, ingredients]);

    // Обработчик перехода к деталям заказа
    const navigateToOrder = () => {
      navigate(getOrderPath(listType, order.number), {
        state: { background: location }
      });
    };

    if (!orderInfo) return null;

    return (
      <div
        onClick={navigateToOrder}
        role='button'
        aria-label={`Order ${order.number} details`}
        className='cursor-pointer'
      >
        <OrderCardUI
          orderInfo={orderInfo}
          maxIngredients={maxIngredients}
          locationState={{ background: location }}
        />
      </div>
    );
  }
);

// готово
