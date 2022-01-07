import React from 'react';
import { withRouter } from 'react-router';

const Home = ({ history }) => {
  const goHome = () => {
    history.push('/app');
  }

  return (
    <button className="goHome" onClick={goHome}>Home</button>
  );
}

export default withRouter(Home);
