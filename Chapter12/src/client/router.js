import React from 'react';
import { BrowserRouter, StaticRouter, Route, Redirect, Switch } from 'react-router-dom';
import LoginRegisterForm from './components/loginregister';
import Main from './Main';
import User from './User';

let Router;
if(typeof window !== typeof undefined) {
  Router = BrowserRouter;
}
else {
  Router = StaticRouter;
}

export const routing = ({ changeLoginState, loggedIn, context, location }) => {
  return (
    <Router context={context} location={location}>
      <Switch>
        <PrivateRoute path="/app" component={() => <Main changeLoginState={changeLoginState} />} loggedIn={loggedIn}/>
        <PrivateRoute path="/user/:username" component={props => <User {...props} changeLoginState={changeLoginState}/>} loggedIn={loggedIn}/>
        <LoginRoute exact path="/" component={() => <LoginRegisterForm changeLoginState={changeLoginState}/>} loggedIn={loggedIn}/>
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    rest.loggedIn === true
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
  )} />
)

const LoginRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    rest.loggedIn === false
      ? <Component {...props} />
      : <Redirect to={{
          pathname: (typeof props.location.state !== typeof undefined) ?
          props.location.state.from.pathname : '/app',
        }} />
  )} />
)

const NotFound = () => {
  return (
    <Redirect to="/"/>
  );
}

export default routing;
