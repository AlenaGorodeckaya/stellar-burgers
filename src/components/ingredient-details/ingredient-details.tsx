import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useAppSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

import { selectIngredientById } from '../../slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return null;
  }

  const ingredientData = useAppSelector((state) =>
    selectIngredientById(state)(id)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
