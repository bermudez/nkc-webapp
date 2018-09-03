import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import appConfig from '../Config/params';

const deviceWidth = window.innerWidth;
const deviceHeight = window.innerHeight;

class MenuScreen extends Component {
  goTo(route) {
    // alert(route);
    this.props.history.replace(`/${route}`)
  }

  componentWillMount() {

  }

  render() {
    return (
      <div style={styles.container} >
        <center>
          <div style={ styles.logoContainer }>
            <img
              style={ styles.logo }
              src={appConfig.app.UI_IMAGES_BASE_URL + "NKCBarWars_Logo.png"}
            />
            <img
              style={ styles.logo }
              src={appConfig.app.UI_IMAGES_BASE_URL + "AnnouncementLogo_TopRight.png"}
            />
          </div>

          <div style={styles.divBtn}>

              <img
                style={ styles.btn }
                src={appConfig.app.UI_IMAGES_BASE_URL+"MainMenu-ScheduleButton.png"}
                onClick={this.goTo.bind(this, 'schedule')}
              />

          </div>

          <div style={styles.divBtn}>
              <img
                style={ styles.btn }
                src={appConfig.app.UI_IMAGES_BASE_URL+"MainMenu-MapButton.png"}
                onClick={this.goTo.bind(this, 'map')}
              />
          </div>

          <div style={styles.divBtn}>
              <img
                style={ styles.btn }
                src={appConfig.app.UI_IMAGES_BASE_URL+"MainMenu-VenueButton.png"}
                onClick={this.goTo.bind(this, 'venue')}
              />
          </div>

          <div style={styles.divBtn}>
              <img
                style={ styles.btn }
                src={appConfig.app.UI_IMAGES_BASE_URL+"MainMenu-BadgesButton.png"}
                onClick={this.goTo.bind(this, 'badges')}
              />
          </div>

          <div style={styles.divBtn}>
              <img
                style={ styles.btn }
                src={appConfig.app.UI_IMAGES_BASE_URL+"MainMenu-MySnapsRepositoryButton.png"}
                onClick={this.goTo.bind(this, 'snaps')}
              />
          </div>

          <div style={styles.divBtn}>
            <a href='https://s3.us-east-2.amazonaws.com/swiftmile-app-assets/ui-images/FAQ.html'>
              <img 
                style={ styles.btn } 
                src={appConfig.app.UI_IMAGES_BASE_URL+'MainMenu-FAQButton.png'}
              />
            </a>
          </div>

          <div style={styles.divBtn}>
              <img
                style={ styles.btn }
                src={appConfig.app.UI_IMAGES_BASE_URL+"MainMenu-AboutButton.png"}
                onClick={this.goTo.bind(this, 'about')}
              />
          </div>

        </center>
      </div>

    );
  }
}

const styles = {
  container: {
    //flex: 1,
    flexDirection: 'row',
    //flexWrap: 'wrap',
    maxWidth: 736, //736
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundImage: 'url('+appConfig.app.UI_IMAGES_BASE_URL+'Background-MainMenu.png'+')'
  },
  image: {
    width: deviceWidth,
    height: deviceHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  divBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginBottom: 5
  },
  btn: {
    width: 200, //200
    height: 50,
    //paddingTop: 30,
    paddingTop: 0,
    marginBottom: 20,
    //marginBottom: 0,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    backgroundColor: '#fff',
    resizeMode: 'contain',
    //justifyContent: 'center',
    alignItems: 'center',
    //flex: 1,
    //alignSelf: 'stretch',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginBottom: 5
  },
  logo: {
    width: 150, //150
    height: 100,
    paddingTop: 3,
    padding: 3,
    resizeMode: 'contain',
    alignItems: 'center'
  }
};

export default MenuScreen;
