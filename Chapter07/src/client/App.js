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
import 'cropperjs/dist/cropper.css';

const App = ({ client }) => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('jwt'));
    const [loadCurrentUser, { error, data }] = useCurrentUserQuery();

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

    useEffect(() => {
        if(loggedIn) {
            loadCurrentUser();
        }
    }, [loggedIn])

    return (
        <div className="container">
            <Helmet>
                <title>Graphbook - Feed</title>
                <meta name="description" content="Newsfeed of all your friends on Graphbook" />
            </Helmet>
            {loggedIn && data && data.currentUser && (
                <div>
                    <Bar currentUser={data.currentUser} changeLoginState={setLoggedIn} />
                    <Feed currentUser={data.currentUser} />
                    <Chats currentUser={data.currentUser} />
                </div>
            )}
            {!loggedIn && <LoginRegisterForm changeLoginState={setLoggedIn} />}
            {!loggedIn && error && <Error><p>{error.message}</p></Error>}
        </div>
    )
}

export default withApollo(App)