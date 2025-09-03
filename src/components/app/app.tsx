import {
  Routes, // Обертка для групп маршрутов
  Route, // Для определения маршрута
  useNavigate // Хук для навигации
} from 'react-router-dom';

import {
  ConstructorPage, // Главная страница бургер-конструктора
  Feed, // Лента заказов
  ForgotPassword, // Страница восстановления пароля
  Login, // Страница авторизации
  NotFound404, // Страница 404 ошибки
  Profile, // Страница профиля
  ProfileOrders, // Страница с историей заказов
  Register, // Страница регистрации
  ResetPassword // Страница сброса пароля
} from '@pages';

import '../../index.css';

import styles from './app.module.css';

// Импорт вспомогательных компонентов
import {
  AppHeader, // Шапка приложения
  IngredientDetails, // Компонент с деталями ингредиента
  Modal, // Компонент модального окна
  OrderModal,
  OrderInfo, // Компонент с информацией о заказе
  withProtection
} from '@components';

const App = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.app}>
      <AppHeader />
      <>
        <Routes>
          <Route path='*' element={<NotFound404 />} />
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/ingredients/:id' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<Feed />} />
          <Route
            path='/login'
            element={withProtection(<Login />, { onlyUnAuth: true })}
          />
          <Route
            path='/register'
            element={withProtection(<Register />, { onlyUnAuth: true })}
          />
          <Route
            path='/forgot-password'
            element={withProtection(<ForgotPassword />, { onlyUnAuth: true })}
          />
          <Route
            path='/reset-password'
            element={withProtection(<ResetPassword />, { onlyUnAuth: true })}
          />
          <Route path='/profile' element={withProtection(<Profile />)} />
          <Route
            path='/profile/orders'
            element={withProtection(<ProfileOrders />)}
          />
          <Route
            path='/profile/orders/:number'
            element={withProtection(<ProfileOrders />, {
              wallpaper: true
            })}
          />
        </Routes>
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate('/')}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <OrderModal onClose={() => navigate('/feed')}>
                <OrderInfo />
              </OrderModal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={withProtection(
              <OrderModal onClose={() => navigate('/profile/orders')}>
                <OrderInfo />
              </OrderModal>,
              { wallpaper: true }
            )}
          />
        </Routes>
      </>
    </div>
  );
};

export default App;
