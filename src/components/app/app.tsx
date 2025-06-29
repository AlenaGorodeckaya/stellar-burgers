import { ReactElement, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';
import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  NotFound404,
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import { ProtectedRoute } from '../../components/protected-route/protected-route';
import styles from './app.module.css';
import '../../index.css';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/createSlice/ingredientsReducer';
import { Preloader } from '@ui';
import BaseLayout from '../ui/layout/BaseLayout';

// Исправленная функция для защищенных маршрутов
function makeProtected(
  element: ReactElement,
  { onlyForGuests = false }: { onlyForGuests?: boolean } = {}
) {
  return (
    <ProtectedRoute onlyForGuests={onlyForGuests}>{element}</ProtectedRoute>
  );
}

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.ingredients);
  const { isAuthCheckComplete } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const onModalClose = () => {
    if (location.pathname.startsWith('/feed/')) {
      navigate('/feed');
    } else if (location.pathname.startsWith('/profile/orders/')) {
      navigate('/profile/orders');
    } else {
      navigate(backgroundLocation?.pathname || '/', {
        state: null,
        replace: true
      });
    }
  };

  // Если проверка авторизации не завершена, показываем прелоадер
  if (!isAuthCheckComplete) {
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );
  }

  // Если загружаются ингредиенты, показываем прелоадер
  if (isLoading) {
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>Ошибка загрузки ингредиентов: {error}</div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route element={<BaseLayout />}>
          <Route path='*' element={<NotFound404 />} />
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />

          <Route
            path='/login'
            element={makeProtected(<Login />, { onlyForGuests: true })}
          />
          <Route
            path='/register'
            element={makeProtected(<Register />, { onlyForGuests: true })}
          />
          <Route
            path='/forgot-password'
            element={makeProtected(<ForgotPassword />, { onlyForGuests: true })}
          />
          <Route
            path='/reset-password'
            element={makeProtected(<ResetPassword />, { onlyForGuests: true })}
          />

          <Route path='/profile' element={makeProtected(<Profile />)} />
          <Route
            path='/profile/orders'
            element={makeProtected(<ProfileOrders />)}
          />

          <Route path='/ingredients/:id' element={<IngredientDetails />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route
            path='/profile/orders/:number'
            element={makeProtected(<OrderInfo />)}
          />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={onModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={onModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={makeProtected(
              <Modal title='Информация о заказе' onClose={onModalClose}>
                <OrderInfo />
              </Modal>
            )}
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
