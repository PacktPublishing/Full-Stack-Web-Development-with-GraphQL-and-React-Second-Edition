import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Feed from './Feed';
import Chats from './Chats';
import Bar from './components/bar';
import LoginRegisterForm from './components/loginregister';
import Error from './components/error';
import { useCurrentUserQuery } from './apollo/queries/currentUserQuery';
import { withApollo } from '@apollo/client/react/hoc';
import './components/fontawesome';
import '../../assets/css/style.css';

const App = ({ client }) => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('jwt'));
    const { data, error, loading } = useCurrentUserQuery();

    useEffect(() => {
        const unsubscribe = client.onClearStore(
            () => {
                if(loggedIn){
                    setLoggedIn(false)
                }
            }
        );
        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <div className="container">
            <Helmet>
                <title>Graphbook - Feed</title>
                <meta name="description" content="Newsfeed of all your friends on Graphbook" />
            </Helmet>
            {loggedIn && (
                <div>
                    <Bar changeLoginState={setLoggedIn} />
                    <Feed />
                    <Chats />
                </div>
            )}
            {!loggedIn && <LoginRegisterForm changeLoginState={setLoggedIn} />}
            {!loggedIn && error && <Error><p>{error.message}</p></Error>}
        </div>
    )
}

export default withApollo(App)