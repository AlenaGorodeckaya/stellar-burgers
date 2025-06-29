import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';
import { fetchOrderById } from '../../services/createSlice/feedReducer';

export const OrderInfo: FC = () => {
  // Получаем параметры из URL
  const { number } = useParams();
  // Получаем информацию о текущем маршруте
  const location = useLocation();
  // Инициализируем dispatch для работы с Redux
  const dispatch = useDispatch();

  // Получаем данные заказа и ингредиентов из Redux store
  const orderData = useSelector(
    (state) => state.feed.selectedOrders[0] ?? null
  );
  const ingredients = useSelector((state) => state.ingredients.items);

  // Эффект для загрузки данных заказа при изменении номера заказа
  useEffect(() => {
    if (!Number(number)) return; // Проверяем, что номер заказа - число
    dispatch(fetchOrderById(Number(number)));
  }, [number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    // Тип для хранения ингредиентов с количеством
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Собираем информацию об ингредиентах с их количеством
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

    // Вычисляем общую стоимость заказа
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

  // Показываем прелоадер, если данные еще не загружены
  if (!orderInfo) {
    return <Preloader />;
  }

  // Проверяем, открыт ли компонент в модальном окне
  const isModal = !!location.state?.background;

  // Если это модальное окно - просто рендерим, иначе центрируем на странице
  return isModal ? (
    <OrderInfoUI orderInfo={orderInfo} />
  ) : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <OrderInfoUI orderInfo={orderInfo} />
    </div>
  );
};

// готово
