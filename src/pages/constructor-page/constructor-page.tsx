import { FC, useEffect } from 'react';
import styles from './constructor-page.module.css';
import { Preloader } from '../../components/ui';
import { BurgerIngredients, BurgerConstructor } from '../../components';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  fetchIngredients,
  selectIngredientsLoading
} from '../../slices/ingredientsSlice';
import { useParams, useLocation } from 'react-router-dom';
import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';
import { BackgroundProps } from './../../components/protected-route/type';

export const ConstructorPage: FC<BackgroundProps> = ({
  wallpaper
}: BackgroundProps) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const background = location.state?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
  }, []);

  const isIngredientsLoading = useAppSelector(selectIngredientsLoading);

  if (id && !background) {
    return <IngredientDetails />;
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
