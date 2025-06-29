import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

import {
  moveIngredient,
  removeIngredient
} from '../../services/createSlice/constructorReducer';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Обработчик перемещения ингредиента вниз
    const handleMoveDown = () => {
      dispatch(moveIngredient({ id: ingredient.id, direction: 'down' }));
    };

    // Обработчик перемещения ингредиента вверх
    const handleMoveUp = () => {
      dispatch(moveIngredient({ id: ingredient.id, direction: 'up' }));
    };

    // Обработчик удаления ингредиента
    const handleClose = () => {
      dispatch(removeIngredient({ id: ingredient.id }));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);

// готово
