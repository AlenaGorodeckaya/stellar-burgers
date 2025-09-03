import styles from './constructor-page.module.css';

import { BurgerIngredients, BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC, useEffect } from 'react';

import {
  fetchIngredients,
  selectIngredientsLoading
} from '../../slices/ingredientsSlice';

import { useAppSelector, useAppDispatch } from '../../services/store';

import { BackgroundProps } from './../../components/protected-route/type';

export const ConstructorPage: FC<BackgroundProps> = ({
  wallpaper
}: BackgroundProps) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const isIngredientsLoading = useAppSelector(selectIngredientsLoading);

  return (
    <>
      {isIngredientsLoading ? (
        wallpaper ? null : (
          <Preloader />
        )
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};
