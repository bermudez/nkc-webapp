import React, { Component } from 'react';

import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookShareCount,
  GooglePlusShareCount,
  LinkedinShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  EmailIcon,
} from 'react-share';

const shareUrl = 'http://nkcgo.com';
const title = 'NKCGo - My Badge';

export default class BadgeComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      badges: props.badges
    };
    console.log('initial Props');
    console.log(props.badges);
  }
  componentWillReceiveProps(nextProps) {
    console.log('nextProps.VenuesData');
    console.log(nextProps.badges);
    this.setState({ badges: nextProps.badges });
  }

  goTo(route) {
    // alert(route);
    this.props.history.replace(`/${route}`)
  }

  render() {

    return (
        <div>
          <center>
          <p style={styles.introText}> If you see any badge below, you can claim your associated badges from the NKC Business Council at 320 Armour Road (suite 220, 2nd floor) from 8:30 AM to 3:30 PM on Tuesday (12 Sept) to Thursday (14 Sept).</p>
          <p style={styles.navigationText}> <a href='https://www.google.com/maps/dir/?api=1&dir_action=navigate&travelmode=walking&destination=320 Armour Road, North Kansas City, MO 64116'>(Navigate to the NKC Business Council building.) </a> </p>
          <p> -------------------------------  </p>
          </center>

        {
          this.state.badges.map((mybadge) => (
            <div
              style={styles.badgeInfo}
              key={mybadge.id}
            >
              <center>
                <img style={styles.imageBadge}
                  alt=""
                  src={mybadge.image_url}
                />
                <p style={styles.badgeTitle}>{mybadge.badgeName}{'\n\n'}</p>
              </center>


              <div className="Nkcgo_social-network">
                <center>
                  <FacebookShareButton
                    url={shareUrl}
                    quote={title}
                    className="Nkcgo_social-network__share-button">
                    <FacebookIcon
                      size={32}
                      round />
                  </FacebookShareButton>

                  <FacebookShareCount
                    url={shareUrl}
                    className="Nkcgo_social-network__share-count">
                    {count => count}
                  </FacebookShareCount>

                  <TwitterShareButton
                    url={shareUrl}
                    title={title}
                    className="Nkcgo_social-network__share-button">
                    <TwitterIcon
                      size={32}
                      round />
                  </TwitterShareButton>

                  <div className="Nkcgo_social-network__share-count">
                    &nbsp;
                  </div>
                </center>
              </div>




            </div>
          ))
      }
      </div>
    );
  }
}

const styles = {
  imageBadge: {
    width: Screen.width/4,
    height: Screen.width/4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeTitle: {
    fontSize: 20
  },
  badgeInfo: {
    marginBottom: 10
  },
  introText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navigationText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  }
};
