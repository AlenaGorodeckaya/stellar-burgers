import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  selectOrderDetails
} from '../../slices/orderDetailsSlice';
import { selectIngredients } from '../../slices/ingredientsSlice';
import styles from '../../components/ui/order-info/order-info.module.css';

export const OrderInfo: FC = () => {
  const dispatch = useAppDispatch();
  const orderData = useAppSelector(selectOrderDetails);
  const ingredients = useAppSelector(selectIngredients);
  const number = Number(useParams<{ number: string }>().number);
  const location = useLocation();

  useEffect(() => {
    if (!!number) {
      dispatch(fetchOrderByNumber(number));
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  const isDirectAccess = !location.state?.background;

  if (isDirectAccess) {
    return (
      <div className={styles.directAccessContainer}>
        <h1 className={`text text_type_digits-default ${styles.orderNumber}`}>
          #{String(orderInfo.number).padStart(6, '0')}
        </h1>
        <div className={styles.wrap}>
          <OrderInfoUI orderInfo={orderInfo} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};
