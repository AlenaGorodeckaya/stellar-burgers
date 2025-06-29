import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useDispatch, useSelector } from '../../services/store';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { selectIngredient } from '../../services/createSlice/ingredientsReducer';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  //  id ингредиента из параметров URL
  const { id } = useParams();

  // Получаем данные
  const ingredientData = useSelector(
    (state) => state.ingredients.selectedIngredient
  );
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.isLoading
  );
  const ingredients = useSelector((state) => state.ingredients.items);

  // Эффект для загрузки данных ингредиента при изменении id или списка ингредиентов
  useEffect(() => {
    // Если нет id, перенаправляем на главную страницу
    if (!id) {
      navigate('/');
      return;
    }

    // Если список ингредиентов загружен, выбираем нужный ингредиент
    if (ingredients.length) {
      dispatch(selectIngredient(id));
    }
  }, [id, dispatch, navigate, ingredients.length]);

  // Показываем прелоадер, если данные загружаются или ингредиент не выбран
  if (isIngredientsLoading || !ingredientData) {
    return <Preloader />;
  }

  const isModal = !!location.state?.background;

  return isModal ? (
    <IngredientDetailsUI ingredientData={ingredientData} />
  ) : (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}
    >
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};

// готово
