import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { selectUserData } from '../../slices/userSlice';

export const AppHeader: FC = () => {
  const userData = useAppSelector(selectUserData);

  return <AppHeaderUI userName={userData?.name || ''} />;
};
