import { ReactElement } from 'react';

export type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
  wallpaper?: boolean;
};

export type BackgroundProps = {
  wallpaper?: boolean;
};
