import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { withApollo } from '@apollo/client/react/hoc';
import Router from '../../client/router';
import { useCurrentUserQuery } from '../../client/apollo/queries/currentUserQuery';
import '../../client/components/fontawesome';

const App = ({ location, context, loggedIn: loggedInProp }) => {
  const { data, loading, error } = useCurrentUserQuery();
  const [loggedIn, setLoggedIn] = useState(loggedInProp);

  return (
    <div className="container">
      <Helmet>
        <title>Graphbook - Feed</title>
        <meta name="description" content="Newsfeed of all your friends on Graphbook" />
      </Helmet>
      <Router loggedIn={loggedIn} changeLoginState={setLoggedIn} location={location} context={context} />
    </div>
  )
}

export default withApollo(App)
