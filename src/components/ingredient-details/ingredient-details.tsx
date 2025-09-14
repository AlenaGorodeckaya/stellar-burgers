import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/store';
import { useParams, useLocation } from 'react-router-dom';
import { selectIngredientById } from '../../slices/ingredientsSlice';
import styles from '../../components/ui/ingredient-details/ingredient-details.module.css';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const background = location.state?.background;

  if (!id) {
    return null;
  }

  const ingredientData = useAppSelector((state) =>
    selectIngredientById(state)(id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  const isDirectAccess = !background;

  if (isDirectAccess) {
    return (
      <div className={styles.directAccessContainer}>
        <h1 className={`text text_type_main-large mt-10 mb-5`}>
          Детали ингредиента
        </h1>
        <IngredientDetailsUI ingredientData={ingredientData} />
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
