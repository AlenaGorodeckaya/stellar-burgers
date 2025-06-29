import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { updateUserProfile } from '../../services/createSlice/authReducer';
import { useSelector, useDispatch } from '../../services/store';
import { TRegisterData } from '@api';
import { Modal } from '@components';

export const Profile: FC = () => {
  // Данные пользователя и статус запроса из стора
  const { userData, requestStatus } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Локальное состояние для значений формы профиля
  const [formValue, setFormValue] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    password: ''
  });

  // Состояние для управления показом модального окна с ошибкой
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Эффект: обновление формы при изменении данных пользователя
  useEffect(() => {
    setFormValue({
      name: userData?.name || '',
      email: userData?.email || '',
      password: ''
    });
  }, [userData]);

  // Эффект: отображение модального окна при ошибке запроса
  useEffect(() => {
    if (requestStatus === 'failed') {
      setErrorMessage('Ошибка при обновлении профиля');
      setShowErrorModal(true);
    }
  }, [requestStatus]);

  // Проверка изменения данных
  const isFormChanged =
    formValue.name !== userData?.name ||
    formValue.email !== userData?.email ||
    !!formValue.password;

  // Обработчик отправки формы
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const updateData: Partial<TRegisterData> = {
        name: formValue.name,
        email: formValue.email,
        ...(formValue.password && { password: formValue.password })
      };

      // Отправляем данные через dispatch и разворачиваем результат
      const result = await dispatch(updateUserProfile(updateData)).unwrap();

      if (!result.success) {
        throw new Error('Не удалось обновить профиль');
      }

      // Сбрасываем поле пароля после успешного обновления
      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      // Отображаем сообщение об ошибке в модальном окне
      setErrorMessage(
        err instanceof Error ? err.message : 'Неизвестная ошибка'
      );
      setShowErrorModal(true);
    }
  };

  // Обработчик отмены изменений (к текущим данным пользователя)
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: userData?.name || '',
      email: userData?.email || '',
      password: ''
    });
  };

  // Обработчик изменения значения полей ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Закрытие модального окна ошибки
  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
      {showErrorModal && (
        <Modal title='Ошибка' onClose={handleCloseModal}>
          <p className='text text_type_main-default mt-4'>{errorMessage}</p>
        </Modal>
      )}

      <ProfileUI
        formValue={formValue}
        isFormChanged={isFormChanged}
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
      />
    </>
  );
};
