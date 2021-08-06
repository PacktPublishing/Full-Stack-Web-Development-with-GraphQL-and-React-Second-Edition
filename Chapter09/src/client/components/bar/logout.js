import React from 'react';
import { withApollo } from '@apollo/client/react/hoc';
import { useLogoutMutation } from '../../apollo/mutations/logout';

const Logout = ({ changeLoginState, client }) => {
  const [logoutMutation] = useLogoutMutation();

  const logout = () => {
    logoutMutation().then(() => {
      localStorage.removeItem('jwt');
      changeLoginState(false);
      client.stop();
      client.resetStore();
    });
  }

  return (
    <button className="logout" onClick={logout}>Logout</button>
  );
}

export default withApollo(Logout);
