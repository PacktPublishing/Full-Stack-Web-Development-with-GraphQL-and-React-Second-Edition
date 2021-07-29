import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Router from './router';
import { useCurrentUserQuery } from './apollo/queries/currentUserQuery';
import { withApollo } from '@apollo/client/react/hoc';
import './components/fontawesome';
import '../../assets/css/style.css';
import 'cropperjs/dist/cropper.css';

const App = ({ client }) => {
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('jwt'));
    const [currentUser, setCurrentUser] = useState(null);
    const [loadCurrentUser, { data, loading }] = useCurrentUserQuery({
        onCompleted() {
            setCurrentUser(data?.currentUser);
        }
    });

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
        } else {
            setCurrentUser(null);
        }
    }, [loggedIn]);

    return (
        <div className="container">
            <Helmet>
                <title>Graphbook - Feed</title>
                <meta name="description" content="Newsfeed of all your friends on Graphbook" />
            </Helmet>
            <Router loggedIn={loggedIn} changeLoginState={setLoggedIn}/>
        </div>
    )
}

export default withApollo(App)