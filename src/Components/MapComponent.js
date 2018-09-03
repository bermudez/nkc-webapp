import React, { Component } from 'react';
import appConfig from '../Config/params';
import {Map, InfoWindow, Marker, Polygon, GoogleApiWrapper} from 'google-maps-react';
import history from '../history';

const map_key = appConfig.googlemaps.key;
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

export class MapComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mapMarkers: props.mapMarkers,
      mapClusters: props.mapClusters
    };
    console.log('initial Props');
    console.log(props);
    this.initialRegion = {
            //lat: 39.135452,
            lat: 39.133446,
            //lng: -94.577164
            lng: -94.577145
          };
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps');
    console.log(nextProps);
    this.setState({ mapMarkers: nextProps.mapMarkers });
    this.setState({ mapClusters: nextProps.mapClusters });
  }
  onMarkerClick(e, venue_key, show_in_venueList)
  {
    console.log(this.props);
    if(show_in_venueList=="Yes")
    {
      history.replace('/venue',{venue_key:venue_key});
    }
  }
  onMapClicked(e)
  {
    console.log(e);
    // alert("Map clicked");
  }
  onPolygonClick(e)
  {

  }

  goTo(route) {
    this.props.history.replace(`/${route}`);
  }

  render() {

    return (
      <Map
        ref={ref => { this.map = ref; }}
        google={this.props.google}
        zoom={15}
        style={style}
        initialCenter={this.initialRegion}
        onClick={e => this.onMapClicked(e)}
        visible={true}
      >
      {
        (
          this.state.mapClusters.length) && (
          this.state.mapClusters.map(cluster => (
            <Polygon
              key={cluster.key}
              onClick={e => this.onPolygonClick(e, cluster.key)}
              paths={cluster.coordinates}
              strokeColor={cluster.strokeColor}
              strokeOpacity={0.85}
              strokeWeight={3}
              fillColor={cluster.strokeColor}
              fillOpacity={0.30}
            />
            )
          )
        )
      }
      {
        this.state.mapMarkers.map(marker => (
          <Marker
            key={marker.venueID}
            position={marker.latlng}
            name={marker.title}
            onClick={e => this.onMarkerClick(e, marker.venueID, marker.showInVenueList)}
            icon={{
              url: marker.markerImage,
              anchor: {x: parseFloat(32), y: parseFloat(32)},
              scaledSize: {width: parseFloat(64), height: parseFloat(64), f: "px", j: "px"}
            }}
          />
          )
        )
      }

      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (map_key)
})(MapComponent)

const style = {
  width: '100%',
  height: '100%'
};
