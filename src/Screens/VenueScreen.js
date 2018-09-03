import React, { Component } from 'react';
import VenueSwiperComponent from '../Components/VenueSwiperComponent';
import appConfig from '../Config/params';

export default class VenueScreen extends Component {

  constructor(props) {
    super(props);
    
    console.log('Venue props ------');
    console.log(props);
    let venue_param = props.location.state;
    if(venue_param!==undefined && venue_param.venue_key!==undefined)
    {
      this.state = {
        VenuesData: [],
        currentVenueKey: venue_param.venue_key
      };
    }
    else
    {
      this.state = {
        VenuesData: [],
        currentVenueKey: 0
      };
    }
  }

  // constructor(props) {
  //   super(props);
  //   this.state = { width: '0', height: '0', current_latitude:0, current_longitude:0, VenuesData:[] };
  // }

  componentDidMount() {
    fetch(appConfig.app.API_BASE_URL+'venues')
      .then(response => response.json())
      .then((responseData) => { 
        console.log(JSON.parse(responseData.body));
        //JSON.parse(responseData.body)
        // venue.showInVenueList = "Yes"
        let allVenuesData = JSON.parse(responseData.body);
        let tempVenuesData = [];
        for (var i = 0; i < allVenuesData.length; i++) {
          if(allVenuesData[i].showInVenueList == "Yes")
          {
            tempVenuesData.push(allVenuesData[i]);
          }
        }
        console.log("allVenuesData - ");
        console.log(allVenuesData.length);
        console.log("Valid POIS Data - ");
        console.log(tempVenuesData.length);

        this.setState({ VenuesData: tempVenuesData }); 
      });
  }

  render() {

    return (
        <VenueSwiperComponent auth={this.props.auth}  currentVenueKey={ this.state.currentVenueKey } VenuesData={ this.state.VenuesData } />
    );
  }
}
