import React, { Component} from 'react';
import { Button } from 'react-bootstrap';

import history from '../history';

export default class UserListComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: props.users
    };
    console.log('initial Props');
    console.log(props.users);
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps.Users');
    console.log(nextProps.users);
    this.setState({ users: nextProps.users });
  }

  goToSnaps(e, user_id)
  {
      history.replace('/snaps',{user_id:user_id});
  }

  goTo(route) {
    // alert(route);
    this.props.history.replace(`/${route}`)
  }

  render() {

    return (
        <div>
        <table className="table table-hover">
    <thead>
      <tr>
        <th>User Id</th>
        <th>Email</th>
        <th>Name</th>
        <th>Snaps Count</th>
        <th>SignedUpAt</th>
      </tr>
    </thead>
    <tbody>
    {

    this.state.users.map((user) => (
      <tr key={user.id} >
        <td>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={e => this.goToSnaps(e, user.id)}
            >
              {user.id}
            </Button></td>
        <td>{user.email}</td>
        <td>{user.name}</td>
        <td>{user.snaps_count}</td>
        <td>{ new Date(user.createdAt).toLocaleTimeString("en-us", { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</td>
      </tr>
          ))
      }
      
    </tbody>
  </table>
        
      </div>
    );
  }
}

const styles = {
  imageBadge: {
    width: screen.width/4,
    height: screen.width/4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeTitle: {
    fontSize: 20
  },
  badgeInfo: {
    marginBottom: 10
  }
};
