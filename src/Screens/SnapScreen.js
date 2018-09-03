import React, { Component } from 'react';
import SnapComponent from '../Components/SnapComponent';
import appConfig from '../Config/params';

export default class SnapScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      SnapsData: [],
      snapsLoaded: false,
      errorMessage:""
    };
  }

  login() {
    this.props.auth.login();
  }

  checkAuth()
  {

  }

  componentDidMount() {
    //this.props.auth.getIdToken()
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

    fetch(appConfig.app.API_BASE_URL+'snaps', {
      method: 'GET',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userIdToken_temp
                }
    })
      .then(response => response.json())
      .then((responseData) => { 
        console.log(JSON.parse(responseData.body));
        //JSON.parse(responseData.body)
        
        this.setState({ snapsLoaded: true }); 
        this.setState({ SnapsData: this.sortSnaps(JSON.parse(responseData.body)) }); 
        // this.setState({ SnapsData: JSON.parse(responseData.body) }); 
      })
      .catch((err) => { 
        this.displayErrorMessage("Failed to load yous snaps from server. Please try again");
        console.log(err);
      });
      ;
  }

  sortSnaps(snapsDataArray){
     let len = snapsDataArray.length;
     for (let i = len-1; i>=0; i--){
       for(let j = 1; j<=i; j++){
         if(snapsDataArray[j-1].createdAt < snapsDataArray[j].createdAt){
             let temp = snapsDataArray[j-1];
             snapsDataArray[j-1] = snapsDataArray[j];
             snapsDataArray[j] = temp;
          }
       }
     }
     return snapsDataArray;
  }

  displayErrorMessage(message)
  {
    this.setState({errorMessage: message});
    this.setState({snapsLoaded: true});
  }
  render() {

    return (
      <span>
        {
          this.state.errorMessage && this.state.errorMessage.length?
            <span>Error - { this.state.errorMessage }</span>
          :
            <span></span>
        }
        {
          !this.state.snapsLoaded ?
            <span>Loading your snaps please wait</span>
          :
            this.state.SnapsData.length?
            <SnapComponent snapsLoaded={this.state.snapsLoaded} snaps={ this.state.SnapsData } />
            :
            <span>You have not uploaded any snaps</span>
        }
        </span>
    );
  }
}
