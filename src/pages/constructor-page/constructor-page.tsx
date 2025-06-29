import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/createSlice/ingredientsReducer';
import styles from './constructor-page.module.css';
import { Preloader } from '@ui';
import { BurgerIngredients, BurgerConstructor } from '@components';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.ingredients.isLoading);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
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
  );
};
