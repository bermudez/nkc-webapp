import React from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import history from '../history';
import appConfig from '../Config/params';

export default class CameraScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { width: '0', height: '0' };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.state.currentVenueKey = null;
    this.state.currentVenueTitle = '';
    this.state.isLoading = false;
    this.state.errorMessage = '';
    this.state.successMessage = '';

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

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    return bb;
  }

  uploadImage(imageSrc)
  {
    if(!imageSrc)
    {
      let errorMessage = "Failed to take a picture image. "+
      "Please check your device compatibility";
      this.displayErrorMessage(errorMessage);
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
        //Upload to S3 and save data in DB
        let bb_imageSrc =  this.dataURItoBlob(imageSrc);
        console.log("URL");
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
                history.replace('/venue',{venue_key:this.state.currentVenueKey});

              })
              .catch((err) => { 
                console.log(err);
                this.displayErrorMessage("Updating to DB server failed. Please try again");
              });
          })
        .catch((err) => { 
              console.log(err);
              this.displayErrorMessage("Storing image to Server failed. Please try again");
        });        
      })
      .catch((err) => { 
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

  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    this.setState({isLoading:true});
    const imageSrc = this.webcam.getScreenshot();
    console.log('imageSrc');
    console.log(imageSrc);
    this.uploadImage(imageSrc);
  };
  
  render() {
    return (
      <div>
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
        <center>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
        />
        </center>
        {
          this.state.isLoading?
          <span>Updating your snap Please wait.</span>
          :
          <center><button onClick={this.capture}>Capture photo</button></center>
        }
        
      </div>
    );
  }
}
