import React from 'react';
import axios from 'axios';
import history from '../history';
import appConfig from '../Config/params';
import Dropzone from 'react-dropzone'

export default class UploadSnapScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { width: '0', height: '0' };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state.currentVenueKey = null;
    this.state.currentVenueTitle = '';
    this.state.isLoading = false;
    this.state.errorMessage = '';
    this.state.successMessage = '';
    this.state.dropzoneDisabled = false;
    let venue_param = props.location.state;
    console.log("Camera Screen: venue_param - ");
    console.log(venue_param);
    
    this.state = {};
    if(venue_param!==undefined && venue_param.venue_key!==undefined)
    {
      const currentVenueKey = venue_param.venue_key;
      this.state = {
        currentVenueKey: venue_param.venue_key
      };
    }
    if(venue_param!==undefined && venue_param.venue_title!==undefined)
    {
      const currentVenueTitle = venue_param.venue_title;
      this.state.currentVenueTitle = venue_param.venue_title;
    }
    console.log("State param - currentVenueKey");
    console.log(this.state.currentVenueKey);
    console.log("State param - currentVenueTitle");
    console.log(this.state.currentVenueTitle);
    
  }

  login() {
    this.props.auth.login();
  }

  onDrop(files) {
    this.setState({dropzoneDisabled: true});
    this.uploadImage(files[0]);
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { isAuthenticated } = this.props.auth;
    const { getIdToken } = this.props.auth;
    var auth_data = isAuthenticated();
    let userIdToken_temp = getIdToken();
    if(isAuthenticated())
    {
      this.setState({userAuthenticated: isAuthenticated()});
      userIdToken_temp = this.props.auth.getIdToken();
    }
    else
    {
      this.login();
    }

    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  uploadImage(imageSrc)
  {
    if(!imageSrc)
    {
      let errorMessage = "Failed to take a picture image. "+
      "Please check your device compatibility";
      this.displayErrorMessage(errorMessage);
      this.setState({dropzoneDisabled: false});
      return;
    }
    const { isAuthenticated } = this.props.auth;
    const { getIdToken } = this.props.auth;
    var auth_data = isAuthenticated();
    let userIdToken_temp = getIdToken();
    if(isAuthenticated())
    {
      this.setState({userAuthenticated: isAuthenticated()});
      userIdToken_temp = this.props.auth.getIdToken();
    }
    else
    {
      this.login();
    }

    fetch(appConfig.app.API_BASE_URL+'snaps_s3_signed_url',{
      method: 'GET',
      headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userIdToken_temp
                }
    })
      .then(response => response.json())
      .then((responseData) => { 
        console.log(JSON.parse(responseData.body));
        return JSON.parse(responseData.body);
      })
      .then((signedUrlData) => {
        let bb_imageSrc = imageSrc;
        console.log("S3 Signed URL (Received from LAMBDA)- ");
        console.log(signedUrlData.url);
        console.log("ImageData");
        console.log(bb_imageSrc);

        axios.put(signedUrlData.url, bb_imageSrc, {
          'ContentEncoding': 'base64', 
          'Content-Type':'image/jpeg'
        })
        // .then(response => response.json())
        .then((responseData) => {
            console.log(responseData);

            //Save to DynamoDB
            fetch(appConfig.app.API_BASE_URL+'snaps',{
                method: 'POST',
                headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer ' + userIdToken_temp
                          },
                body: JSON.stringify({
                        image_url: signedUrlData.filename,
                        venue: this.state.currentVenueKey,
                        venue_title: this.state.currentVenueTitle
                      })
              })
              .then(response => response.json())
              .then((responseData) => { 
                console.log(JSON.parse(responseData.body));
                this.state.isLoading = false;
                this.setState({dropzoneDisabled: false});
                history.replace('/venue',{venue_key:this.state.currentVenueKey});

              })
              .catch((err) => { 
                console.log(err);
                this.setState({dropzoneDisabled: false});
                this.displayErrorMessage("Updating to DB server failed. Please try again");
              });
          })
        .catch((err) => { 
              console.log(err);
              this.setState({dropzoneDisabled: false});
              this.displayErrorMessage("Storing image to Server failed. Please try again");
        });        
      })
      .catch((err) => { 
        this.setState({dropzoneDisabled: false});
        this.displayErrorMessage("Failed to upload image. Please try again");
        console.log(err);
      });
  }
  displayErrorMessage(message)
  {
    this.setState({errorMessage: message});
    this.setState({isLoading: false});
  }

  componentWillUnmount() {
    this.webcam = null;
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }
  
  render() {
    return (
      <div style={styles.dropzoneContainer}>
      {
        this.state.successMessage && this.state.successMessage.length?
          <span>Success - { this.state.successMessage }</span>
        :
          <span></span>
      }
      {
        this.state.errorMessage && this.state.errorMessage.length?
          <span>Error - { this.state.errorMessage }</span>
        :
          <span></span>
      }

      {
        this.state.isLoading?
        <span>Updating your snap Please wait.</span>
        :
        <center>
          <Dropzone 
            onDrop={this.onDrop.bind(this)} 
            style={styles.dropZone} 
            disabledStyle={styles.disabledStyle}
            multiple={false}
            disabled={this.state.dropzoneDisabled}
          >
           { 
            this.state.dropzoneDisabled ?
              <p>Uploading your snaps, please wait</p>
            :
              <p>Click to select image to upload.</p>
            }
          </Dropzone>
        </center>
      }
      </div>
    );
  }
}

const styles = {
  dropZone: {
    color: '#03c',
    backgroundColor: '#e9fdff',
    width: '200px',
    height: '200px',
    fontSize: '20px'
  },
  disabledStyle: {
    color: 'rgb(220, 227, 245)',
    backgroundColor: 'rgb(245, 247, 247)',
    width: '200px',
    height: '200px',
    fontSize: '20px'

  },
  dropzoneContainer:{
    marginTop: '30px'
  }
}
