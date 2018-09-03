import React, { Component } from 'react';
import appConfig from '../Config/params';


import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookShareCount,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';


const shareUrl = 'https://nkcbarwars.com';
const title = 'NKC Bar Wars! ';
//const hashTags = ['NKCBarWars', 'SwiftMile', 'PintPath', 'NKC'];
const hashTags = ['NKCBarWars'];

export default class SnapComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      snaps: props.snaps,
      snapsLoaded: props.snapsLoaded
    };
    console.log('initial Props');
    console.log(props.snaps);
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps.snaps');
    console.log(nextProps.snaps);
    this.setState({ snaps: nextProps.snaps });
    this.setState({ snapsLoaded: nextProps.snapsLoaded });
  }

  goTo(route) {
    // alert(route);
    this.props.history.replace(`/${route}`)
  }

  render() {

    return (
        <div>
        {
          this.state.snaps.map((snap) => (
            <center>
              <div
                key={snap.id}
              >
                {<p>------------------------------------------------------</p>}
                {<p>   </p>}
                <img
                  alt=""
                  style={{
                    height:200,
                    width:200
                  }}
                  src={appConfig.app.USER_UPLOAD_IMAGES_BASE_URL + snap.image_url}
                />
                {
                  snap.venue_title ?
                    <p style={styles.venueTitle}>{snap.venue_title}</p>
                  :
                    <p></p>
                }

                {
                  snap.reviewed ?
                    <div>Reviewed: Yes</div>
                  :
                    <div>Reviewed: No</div>
                }
                {
                  snap.createdAt ?
                    <p>Snap created at - { new Date(snap.createdAt).toLocaleTimeString("en-us", { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</p>
                  :
                    <p></p>
                }
{/*
                {<p>------------------------------------------------------</p>}
                {<p>   </p>}

              <div className="Nkcgo_social-network">
                <center>
                <div className="row">
                  <FacebookShareButton
                    url={shareUrl}
                    title={title}
                    description={snap.venue_title}
                    picture={appConfig.app.USER_UPLOAD_IMAGES_BASE_URL + snap.image_url}
                    quote={title + snap.venue_title}
                    className="Nkcgo_social-network__share-button">
                    <FacebookIcon
                      size={32}
                      round />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={shareUrl}
                    title={title}
                    via={title}
                    hashtags={hashTags}
                    className="Nkcgo_social-network__share-button">
                    <TwitterIcon
                      size={32}
                      round />
                  </TwitterShareButton>
                  </div>
                </center>
              </div>
*/ }

              </div>
            </center>
          ))
      }
      </div>
    );
  }
}

const styles = {
  venueTitle: {
    color: '#03c',
    fontSize: 20,
    fontWeight: 'bold',
  }
};
