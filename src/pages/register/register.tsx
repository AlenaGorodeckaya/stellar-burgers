import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { Modal } from '@components';
import {
  registerUser,
  resetRequestStatus
} from '../../services/createSlice/authReducer';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.auth.isAuthInProgress);
  const requestStatus = useSelector((state) => state.auth.requestStatus);
  const error = useSelector((state) => state.auth.requestStatus === 'failed');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        name: userName,
        email,
        password
      })
    );
  };

  useEffect(() => {
    if (requestStatus === 'success') {
      setUserName('');
      setEmail('');
      setPassword('');
    }
  }, [requestStatus]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <RegisterUI
        errorText={error ? 'Registration failed' : ''}
        email={email}
        userName={userName}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        setUserName={setUserName}
        handleSubmit={handleSubmit}
      />

      {requestStatus === 'failed' && (
        <Modal
          title={'Registration Error'}
          onClose={() => {
            dispatch(resetRequestStatus());
          }}
        >
          <p>Registration failed. Please try again.</p>
        </Modal>
      )}
    </>
  );
};
