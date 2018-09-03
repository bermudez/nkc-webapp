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
    this.goTo('menu');
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
      case 'menu':
        this.state.currentScreenTitle = 'Menu';
        is_menu_screen = true;
      break;
      case 'schedule':
        this.state.currentScreenTitle = 'Schedule';
      break;
      case 'map':
        this.state.currentScreenTitle = 'Map';
      break;
      case 'venue':
        this.state.currentScreenTitle = 'Venue';
      break;
      case 'badges':
        this.state.currentScreenTitle = 'My Badges';
      break;
      case 'snaps':
        this.state.currentScreenTitle = 'My Snaps';
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
            <a>
              <img
                style={ styles.btnNKCGo }
                //src={appConfig.app.UI_IMAGES_BASE_URL+'NKCGoAppIcon3.png'}
                src={appConfig.app.UI_IMAGES_BASE_URL+'NKCBarWars_Logo.png'}
                onClick={this.goTo.bind(this, 'menu')}
              />
            </a>

            {
              !is_menu_screen ?
                <Button
                  bsStyle="primary"
                  className="btn-margin"
                  onClick={this.goTo.bind(this, 'menu')}
                >
                  Show Menu
                </Button>
                : <span></span>
            }
            {
              !isAuthenticated() && (
                  <Button
                    bsStyle="default"
                    bsSize="small"
                    className="btn-margin"
                    onClick={this.login.bind(this)}
                  >
                    Log In
                  </Button>
                )
            }
            {
              isAuthenticated() && (
                  <Button
                    bsStyle="default"
                    bsSize="small"
                    className="btn-margin"
                    onClick={this.logout.bind(this)}
                  >
                    Log Out
                  </Button>
                )
            }
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
