import React, { Component } from 'react';
import SnapsListComponent from '../Components/SnapsListComponent';
import appConfig from '../Config/params';

export default class SnapsListScreen extends Component {

  constructor(props) {
    super(props);

    let param = props.location.state;
    this.state = {};
    var current_user_id = '';
    if(param!==undefined && param.user_id!==undefined)
    {
      var current_user_id = param.user_id;
    }
    this.state = {
      current_user_id: current_user_id,
      SnapsData: [],
      snapsLoaded: false,
      errorMessage:""
    };
    
    this.loadUserSnaps = this.loadUserSnaps.bind(this);
  }
  
  componentDidMount() {
      this.fetchSnapsData();
  }
  
  fetchSnapsData()
  {
    fetch(appConfig.app.API_BASE_URL+'admin/snaps/?user_id='+this.state.current_user_id, {
      method: 'GET',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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

  }

  loadUserSnaps(user_id)
  {
      this.setState({current_user_id: user_id});
      this.fetchSnapsData();
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
            <SnapsListComponent parent={this} snapsLoaded={this.state.snapsLoaded} snaps={ this.state.SnapsData } />
            :
            <span>You have not uploaded any snaps</span>
        }
        </span>
    );
  }
}
