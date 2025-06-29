import { FC, useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';
import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '@ui';
import {
  selectIngredientsByType,
  selectIsLoading
} from '../../services/createSlice/ingredientsReducer';
import { Preloader } from '@ui';

export const BurgerIngredients: FC = () => {
  const buns = useSelector(selectIngredientsByType('bun'));
  const mains = useSelector(selectIngredientsByType('main'));
  const sauces = useSelector(selectIngredientsByType('sauce'));
  const isLoading = useSelector(selectIsLoading);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, inViewBuns] = useInView({ threshold: 0.1 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0.1 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewFilling) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewSauces, inViewFilling]);

  const handleTabClick = (tab: string) => {
    const tabMode = tab as TTabMode;
    setCurrentTab(tabMode);

    const refs = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef
    };
    refs[tabMode].current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={handleTabClick}
    />
  );
};

// готово
