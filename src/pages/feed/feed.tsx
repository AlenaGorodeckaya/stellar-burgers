import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

import { useSelector, useDispatch } from '../../services/store';

import { fetchFeeds } from '../../services/createSlice/feedReducer';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const { feeds, isLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading || !feeds.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feeds}
      handleGetFeeds={() => {
        dispatch(fetchFeeds());
      }}
    />
  );
};
// готово
