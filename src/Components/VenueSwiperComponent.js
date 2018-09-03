import React, { Component } from 'react';
import ReactSwipe from 'react-swipe';
import { Button } from 'react-bootstrap';

import history from '../history';

const GOOGLE_DIR_PREFIX = 'https://www.google.com/maps/dir/?api=1&dir_action=navigate&travelmode=walking&destination=';

export default class VenueSwiperComponent extends Component {

  constructor(props) {
    super(props);
    let currentVenueSliderIndex = this.val2key(props.currentVenueKey, props.VenuesData);
    this.state = {
      VenuesData: props.VenuesData,
      currentVenueKey: props.currentVenueKey,
      startSlide: currentVenueSliderIndex
    };
    console.log('initial Props');
    console.log(props.VenuesData);

    // this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  val2key(val, markers_array){
    console.log("Input - markers_array");
    console.log(markers_array);
    for (var key in markers_array) {
      let array_val = markers_array[key];
      // console.log("Val = ");
      // console.log(val);
      // console.log("Venue id - ");
      // console.log(array_val.venueID);
      if(array_val.venueID === val){
          console.log("Returning final key - ");
          console.log(key);
          let int_key = parseInt(key);
          if(int_key==NaN)
          {
            return 0;
          }
          return int_key;
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps.VenuesData');
    console.log(nextProps.VenuesData);
    let currentVenueSliderIndex = this.val2key(this.state.currentVenueKey, nextProps.VenuesData);
    console.log('currentVenueSliderIndex');
    console.log(currentVenueSliderIndex);
    this.setState({ startSlide: currentVenueSliderIndex });
    this.setState({ VenuesData: nextProps.VenuesData });

  }

  login() {
    this.props.auth.login();
  }

  showMapDirections(e, venue_key, venue_description)
  {
    //alert("Redirect to Google Maps!");
    window.location.href = GOOGLE_DIR_PREFIX+venue_description;
  }

  showCameraScreen(e, venue_key, venue_title)
  {
    console.log("inside - showCameraScreen Venue_key");
    console.log(venue_key);
    console.log("inside - showCameraScreen venue_title");
    console.log(venue_title);

    history.replace('/camera',{venue_key:venue_key, venue_title: venue_title});
  }

  showSnapUploadScreen(e, venue_key, venue_title)
  {
    console.log("inside - showCameraScreen Venue_key");
    console.log(venue_key);
    console.log("inside - showCameraScreen venue_title");
    console.log(venue_title);
    history.replace('/upload',{venue_key:venue_key, venue_title: venue_title});

  }

  goTo(route) {
    // alert(route);
    this.props.history.replace(`/${route}`)
  }

  goToPreviousSlide()
  {
    console.log("Go Previous");
    if(this.swiper)
    {
      console.log("Swiper initialised. Going Previous");
      this.swiper.prev();
    }
    else
    {
      console.log("No Swiper initialised");
    }
  }
  goToNextSlide()
  {
    console.log("Go Next");
    if(this.swiper)
    {
      console.log("Swiper initialised. Going Next");
      this.swiper.next();
    }
    else
    {
      console.log("No Swiper initialised");
    }
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    if(!this.state.VenuesData.length)
    {
      return (
        <div>
          Loading Venue Info please wait
        </div>
      );
    }

    return (
      <div className="slider-wrapper">
        <div className="row">
          <div className="col-xs-6 text-left">
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={this.goToPreviousSlide.bind(this)}
            >
              {'<<'} Previous
            </Button>
          </div>
          <div className="col-xs-6 text-right">   
            <Button
              bsStyle="primary"
              className="btn-margin"
              onClick={this.goToNextSlide.bind(this)}
            >
              Next {'>>'}
            </Button>
          </div>
        </div>

        <ReactSwipe
          key={this.state.VenuesData.length}
          ref={ref => { this.swiper = ref; }}
          swipeOptions={{continuous: true, startSlide: this.state.startSlide}}
        >
        {
          this.state.VenuesData.map(venue => (
            <div
              className="slide-wrapper"
              key={venue.venueID}
            >
            <center>
              <div>
                <p style={styles.venueTitle}>{venue.title}</p>
                <p style={styles.venueDescription}>{venue.description}</p>
                <img
                  alt=""
                  style={{
                    height:200,
                    width:200
                  }}
                  src={venue.markerImage}
                  />
              </div>

              <div>
                <div>
                  <div>
                  {
                    !isAuthenticated() && (
                        <Button
                          bsStyle="primary"
                          className="btn-margin"
                          onClick={this.login.bind(this)}
                        >
                          Login to Check-In
                        </Button>
                      )
                  }
                  {
                    isAuthenticated() && (
                        <Button
                          bsStyle="primary"
                          className="btn-margin"
                          onClick={e => this.showCameraScreen(e, venue.venueID, venue.title)}
                        >
                          Check-In here
                        </Button>
                      ) &&
                      (
                      <Button
                          bsStyle="primary"
                          className="btn-margin"
                          onClick={e => this.showSnapUploadScreen(e, venue.venueID, venue.title)}
                        >
                          Check-In Here (Photo Upload or Snaps)
                        </Button>
                      )
                  }
                  </div>
                </div>
                <div>
                  <div>
                    <Button
                      bsStyle="primary"
                      className="btn-margin"
                      onClick={e => this.showMapDirections(e, venue.venueID, venue.description)}
                    >
                      Get directions to this venue
                    </Button>
                  </div>
                </div>
              </div>
              <p style={styles.venueSpecialOffer}>{venue.notes}</p>
              <p style={styles.venueScavengerHint}>{venue.notes2}</p>
            </center>
            </div>
          ))
        }
        </ReactSwipe>

      </div>
    );
  }
}

const styles = {
  venueTitle: {
    color: '#03c',
    fontSize: 30,
    fontWeight: 'bold',
  },
  venueDescription: {
    color: '#09c',
    fontSize: 17,
    fontWeight: 'normal',
  },
  venueSpecialOffer: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'normal',
  },
  venueScavengerHint: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'normal',
  }

};
