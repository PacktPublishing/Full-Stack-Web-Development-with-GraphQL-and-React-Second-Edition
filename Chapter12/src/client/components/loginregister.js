import React, { useState } from 'react';
import { useLoginMutation } from '../apollo/mutations/login';
import { useSignupMutation } from '../apollo/mutations/signup';
import Loading from './loading';
import Error from './error';

const LoginForm = ({ changeLoginState }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { loading, error }] = useLoginMutation();
  const onSubmit = (event) => {
    event.preventDefault();
    login({
      update(cache, { data: { login } }) {
        if(login.token) {
          localStorage.setItem('jwt', login.token);
          changeLoginState(true);
        }
      }, variables: { email, password }
    });
  }
  return (
    <div className="login">
      {!loading && (
        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input type="text" onChange={(event) => setEmail(event.target.value)} />
          <label>Password</label>
          <input type="password" onChange={(event) => setPassword(event.target.value)} />
          <input type="submit" value="Login" />
        </form>
      )}
      {loading && (<Loading />)}
      {error && (
        <Error><p>There was an error logging in!</p></Error>
      )}
    </div>
  )
}

const RegisterForm = ({ changeLoginState }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [signup, { loading, error }] = useSignupMutation();
  const onSubmit = (event) => {
    event.preventDefault();
    signup({
      update(cache, { data: { login } }) {
        if(login.token) {
          localStorage.setItem('jwt', login.token);
          changeLoginState(true);
        }
      }, variables: { email, password, username }
    });
  }
  return (
    <div className="login">
      {!loading && (
        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input type="text" onChange={(event) => setEmail(event.target.value)} />
          <label>Username</label>
          <input type="text" onChange={(event) =>  setUsername(event.target.value)} />
          <label>Password</label>
          <input type="password" onChange={(event) => setPassword(event.target.value)} />
          <input type="submit" value="Sign up" />
        </form>
      )}
      {loading && (<Loading />)}
      {error && (
        <Error><p>There was an error logging in!</p></Error>
      )}
    </div>
  )
}

const LoginRegisterForm = ({ changeLoginState }) => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="authModal">
      {showLogin && (
        <div>
          <LoginForm changeLoginState={changeLoginState} />
          <a onClick={() => setShowLogin(false)}>Want to sign up? Click here</a>
        </div>
      )}
      {!showLogin && (
        <div>
          <RegisterForm changeLoginState={changeLoginState} />
          <a onClick={() => setShowLogin(true)}>Want to login? Click here</a>
        </div>
      )}
    </div>
  )
}

export default LoginRegisterForm
