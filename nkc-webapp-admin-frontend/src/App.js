import React, { Component } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import './App.css';
import appConfig from './Config/params';

class App extends Component {
  constructor(props)
  {
    super(props);
    this.state={};
    this.state.currentScreenTitle = 'NKCGo';
  }
  goTo(route) {
    this.props.history.replace(`/${route}`)
  }

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  componentWillMount() {
    this.goTo('users');
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    console.log('App Component this.props');
    console.log(this.props.location.pathname);
    let pathname = this.props.location.pathname;
    const browser_pathname = pathname.slice(1, pathname.length);
    var is_menu_screen = false;
    switch(browser_pathname)
    {
      case 'snaps':
        this.state.currentScreenTitle = 'Snaps List';
      break;
      case 'users':
        this.state.currentScreenTitle = 'Users List';
      break;
      case 'badges':
        this.state.currentScreenTitle = 'Badges List';
      break;
      case 'userbadges':
        this.state.currentScreenTitle = 'Add User Badge';
      break;
      default:
        this.state.currentScreenTitle = 'NKCGo';
    }
    return (
      <div>
        <Navbar staticTop inverse style={styles.navbar} fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a>{this.state.currentScreenTitle}</a>
            </Navbar.Brand>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={e => this.goTo('users')}
            >
              Users
            </Button>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={e => this.goTo('snaps')}
            >
              All Snaps
            </Button>
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={e => this.goTo('userbadges')}
            >
              All User Badges
            </Button>
          </Navbar.Header>
        </Navbar>
      </div>
    );
  }
}

const styles = {

  btnNKCGo: {
    width: 75,
    height: 50,
    //paddingTop: 30,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#000',
    backgroundColor: '#000',
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center'
    //flex: 1,
    //alignSelf: 'stretch',
  },
  navbar: {
    marginBottom: "0",
    padding: "0",
    backgroundColor: '#000'
  }
};

export default App;
