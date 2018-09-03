import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import BadgeComponent from '../Components/BadgeComponent';
import appConfig from '../Config/params';

export default class BadgesScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      badges: []
    };
  }

  login() {
    this.props.auth.login();
  }
  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    var auth_data = isAuthenticated();
    let userIdToken_temp = null;
    if(isAuthenticated())
    {
      this.state.userAuthenticated = isAuthenticated();
      userIdToken_temp = this.props.auth.getIdToken();
    }
    else
    {
      this.login();
    }

    fetch(appConfig.app.API_BASE_URL + 'user-badges', {
      method: 'GET',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userIdToken_temp
                }
    })
      .then(response => response.json())
      .then((responseData) => { 
        console.log(responseData);
        // console.log(JSON.parse(responseData));
        //JSON.parse(responseData.body)
        this.setState({ badges: JSON.parse(responseData.body) }); 
      });
  }

  render() {

    return (
        <BadgeComponent  badges={ this.state.badges } />
    );
  }
}
