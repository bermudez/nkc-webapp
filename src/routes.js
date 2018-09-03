import React from 'react';
import { Route, Router } from 'react-router-dom';

import App from './App';
import Auth from './Auth/Auth';
import history from './history';
// import Home from './Home/Home';

/* Screens Start */
import MenuScreen from './Screens/MenuScreen'
import ScheduleScreen from './Screens/ScheduleScreen'
import MapScreen from './Screens/MapScreen'
import VenueScreen from './Screens/VenueScreen'
import BadgesScreen from './Screens/BadgesScreen'
import SnapScreen from './Screens/SnapScreen'
import CameraScreen from './Screens/CameraScreen'
import UploadSnapScreen from './Screens/UploadSnapScreen'
import AboutScreen from './Screens/AboutScreen'
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
    
    var profile = {};
    const { userProfile, getProfile } = auth;
    if (!userProfile) {
        console.log("Getting Auth0 profile");
      getProfile((err, profile) => {
        console.log("Got Auth0 profile");  
        console.log(profile);  
//        profile = profile;
        /* Check on server if user exists and store user */
        checkOrCreateUser(parsedHash.id_token, profile);
        /* handle auth */
        auth.handleAuthentication();
      });
    } else {
      profile = userProfile;
      /* Check on server if user exists and store user */
      checkOrCreateUser(parsedHash.id_token, profile);
      /* handle auth */
      auth.handleAuthentication();
    }
  }
}

/* hack to store auth0 tokens */
function setSession(authResult) {
  let expiresAt = JSON.stringify((authResult.expires_in * 1000) + new Date().getTime());
  localStorage.setItem('access_token', authResult.access_token);
  localStorage.setItem('id_token', authResult.id_token);
  localStorage.setItem('expires_at', expiresAt);
}

function checkOrCreateUser(id_token, profile)
{
    console.log("PROFILE.");
    console.log(profile);
  fetch(API_BASE_URL+'users', {
      method: 'POST',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + id_token
                },
      body: JSON.stringify(profile)
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
  //<Route path="/home" render={(props) => <Home auth={auth} {...props} />} />
  return (
      <Router history={history} component={App}>
        <div>
          <Route path="/" render={(props) => <App auth={auth} {...props} />} />
          <Route path="/menu" render={(props) => <MenuScreen auth={auth} {...props} />} />
          <Route path="/schedule" render={(props) => <ScheduleScreen auth={auth} {...props} />} />
          <Route path="/map" render={(props) => <MapScreen auth={auth} {...props} />} />
          <Route path="/venue" render={(props) => <VenueScreen auth={auth} {...props} />} />
          <Route path="/badges" render={(props) => <BadgesScreen auth={auth} {...props} />} />
          <Route path="/snaps" render={(props) => <SnapScreen auth={auth} {...props} />} />
          <Route path="/camera" render={(props) => <CameraScreen auth={auth} {...props} />} />
          <Route path="/upload" render={(props) => <UploadSnapScreen auth={auth} {...props} />} />
          <Route path="/about" render={(props) => <AboutScreen auth={auth} {...props} />} />

          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />
          }}/>
        </div>
      </Router>
  );
}
