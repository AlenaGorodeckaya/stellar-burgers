import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  resetRequestStatus
} from '../../services/createSlice/authReducer';
import { Modal } from '@components';
import { AppDispatch, RootState } from '../../services/store';

export const Login: FC = () => {
  // Локальное состояние для полей формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { requestStatus, isAuthenticated } = useSelector(
    (state: RootState) => ({
      requestStatus: state.auth.requestStatus,
      isAuthenticated: state.auth.isAuthenticated
    })
  );

  const dispatch: AppDispatch = useDispatch();

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
    }
  }, [isAuthenticated]);

  useEffect(
    () => () => {
      dispatch(resetRequestStatus());
    },
    [dispatch]
  );

  return (
    <>
      {/* Модальное окно для отображения ошибок авторизации */}
      {requestStatus === 'failed' && (
        <Modal
          title='Неверная email или пароль'
          onClose={() => {
            dispatch(resetRequestStatus());
          }}
        />
      )}

      {/* Компонент UI формы входа */}
      <LoginUI
        errorText=''
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
