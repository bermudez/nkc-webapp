import React from 'react';
import { Route, Router } from 'react-router-dom';

import App from './App';
import Auth from './Auth/Auth';
import history from './history';

/* Screens Start */
import UserListScreen from './Screens/UserListScreen'
import SnapsListScreen from './Screens/SnapsListScreen'
import Callback from './Callback/Callback';
/* Screens end */

const API_BASE_URL = 'https://y86lpymaph.execute-api.us-east-2.amazonaws.com/prd/';

const auth = new Auth();
const queryString = require('query-string');

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    console.log(nextState.location.hash);
    let parsedHash = queryString.parse(nextState.location.hash);
    // console.log('parsedHash');
    // console.log(parsedHash);
    /* Set data in local storage */
    setSession(parsedHash);
    /* Check on server if user exists and store user */
    checkOrCreateUser(parsedHash.id_token);
    /* handle auth */
    auth.handleAuthentication();
  }
}

/* hack to store auth0 tokens */
function setSession(authResult) {
  let expiresAt = JSON.stringify((authResult.expires_in * 1000) + new Date().getTime());
  localStorage.setItem('access_token', authResult.access_token);
  localStorage.setItem('id_token', authResult.id_token);
  localStorage.setItem('expires_at', expiresAt);
}

function checkOrCreateUser(id_token)
{
  fetch(API_BASE_URL+'users', {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + id_token
                }
    })
    .then(response => response.json(true))
    .then((responseData) => { 
      let user = JSON.parse(responseData.body);
      localStorage.setItem('user_id', user.id);
      console.log(JSON.parse(responseData.body));
      //JSON.parse(responseData.body)
      
    });
}

export const makeMainRoutes = () => {
  return (
      <Router history={history} component={App}>
        <div>
          <Route path="/" render={(props) => <App auth={auth} {...props} />} />
          <Route path="/users" render={(props) => <UserListScreen auth={auth} {...props} />} />
          <Route path="/snaps" render={(props) => <SnapsListScreen auth={auth} {...props} />} />

          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} /> 
          }}/>
        </div>
      </Router>
  );
}
