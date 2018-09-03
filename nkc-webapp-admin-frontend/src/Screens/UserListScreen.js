import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import UserListComponent from '../Components/UserListComponent';
import appConfig from '../Config/params';

export default class UserListScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      /* 0-ascending, 1-descending */
      order: 0
    };
    this.state.errorMessage = '';
  }

  toggleSortOrder()
  {
      if(this.state.order)
      {
          this.setState({order: 0});
      }
      else
      {
        this.setState({order: 1});  
      }
      let temp_users = this.state.users;
      let sorted_users = this.sortUsers(temp_users, this.state.order);
      this.setState({users: temp_users});
  }
  
  login() {
//    this.props.auth.login();
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

    fetch(appConfig.app.API_BASE_URL + 'admin/users', {
      method: 'GET',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userIdToken_temp
                }
    })
      .then(response => response.json())
      .then((responseData) => { 
//        console.log(responseData);
         console.log(JSON.parse(responseData.body));
        //JSON.parse(responseData.body)
        this.setState({ users: this.sortUsers(JSON.parse(responseData.body), this.state.order) }); 
      });
  }
  
  /* Sort users by snaps count (snaps_count) */
  sortUsers(usersDataArray, order){
      console.log("User before sorting-----------");
      console.log(usersDataArray);
     let len = usersDataArray.length;
     let snaps_count1 = 0;
     let snaps_count2 = 0;
     let tmp_flag = false;
     for (let i = len-1; i>=0; i--){
       for(let j = 1; j<=i; j++){
           if(usersDataArray[j-1].snaps_count!==undefined)
           {
               snaps_count1 = usersDataArray[j-1].snaps_count;
           }
           else
           {
               snaps_count1 = 0;
           }
           if(usersDataArray[j].snaps_count!==undefined)
           {
               snaps_count2 = usersDataArray[j].snaps_count;
           }
           else
           {
               snaps_count2 = 0;
           }
           if(this.state.order)
           {
               tmp_flag = snaps_count1 < snaps_count2 ? true : false;
           }
           else
           {
               tmp_flag = snaps_count1 < snaps_count2 ? false : true;
           }
          if(tmp_flag)
          {
              let temp = usersDataArray[j-1];
              usersDataArray[j-1] = usersDataArray[j];
              usersDataArray[j] = temp;
          }
       }
     }
     console.log("User after sorting-----------");
     console.log(usersDataArray);

     return usersDataArray;
  }

  render() {

    return (
            
        <span>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={e => this.toggleSortOrder(e)}
            >
              Toggle Order
            </Button>
        {
            this.state.users.length?
            <UserListComponent  users={ this.state.users } />
            :
            <span>No users!</span>
        }
        </span>
    );
  }
}
