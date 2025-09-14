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

import { useParams, useLocation } from 'react-router-dom';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';

export const ConstructorPage: FC<BackgroundProps> = ({
  wallpaper
}: BackgroundProps) => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const isIngredientsLoading = useAppSelector(selectIngredientsLoading);

  if (params.id && !background) {
    return (
      <div>
        <IngredientDetails />
      </div>
    );
  }

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
