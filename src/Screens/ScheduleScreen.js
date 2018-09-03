import React, { Component } from 'react';
import appConfig from '../Config/params';

const style = {
  width: '100%',
  height: '100%',
  margin: '0px'
}
export default class ScheduleScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { width: '0', height: '0' };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  render() {
    return (
      <div>
        <img alt="NKCGo Schedule" style={style} src={appConfig.app.UI_IMAGES_BASE_URL + "Schedule.png"} />
      </div>

      );
  }
}