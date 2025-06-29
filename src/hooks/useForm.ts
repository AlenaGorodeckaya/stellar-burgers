import { useState, ChangeEvent } from 'react';

type BaseFormType = {
  [key: string]: any; // Поля формы могут быть любого типа
  errorText?: string | null; // Опциональное поле для ошибок
};

export function useForm<T extends BaseFormType>(initialForm: T) {
  const [form, setForm] = useState<T>(initialForm);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const setField = <K extends keyof T>(name: K, value: T[K]) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Сброс формы к начальному состоянию
  const resetForm = () => {
    setForm(initialForm);
  };

  // Установка ошибки
  const setError = (error: string | null) => {
    setForm((prev) => ({ ...prev, errorText: error }));
  };

  return {
    form, // Текущие значения формы
    handleChange, // Стандартный обработчик изменений
    setField, // Ручное обновление поля
    resetForm, // Сброс формы
    setError, // Установка ошибки
    setForm
  };
}

//готово
