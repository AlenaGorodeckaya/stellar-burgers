import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы для состояния приложения
export type ApplicationPage = 'constructor' | 'feed' | null;

// Интерфейс состояния модуля приложения
interface AppState {
  isLoading: boolean;
  currentPage: ApplicationPage;
}

// Начальное состояние модуля приложения
const initialState: AppState = {
  isLoading: false,
  currentPage: null
};

// Создание слайса для модуля приложения.
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPage: (state, action: PayloadAction<ApplicationPage>) => {
      state.currentPage = action.payload;
    }
  }
});

export const { setLoading, setPage } = appSlice.actions;
export default appSlice.reducer;
