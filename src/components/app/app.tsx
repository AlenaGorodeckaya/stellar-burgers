import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderModal,
  OrderInfo,
  withProtection
} from '@components';
import { useAppDispatch } from '../../services/store';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import { fetchUserData } from '../../slices/userSlice';
import { getCookie } from '../../utils/cookie';
import { useEffect } from 'react';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());

    const accessToken = getCookie('accessToken');
    if (accessToken) {
      dispatch(fetchUserData());
    }
  }, [dispatch]);

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
