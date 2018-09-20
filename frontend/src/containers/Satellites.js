import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import SatelliteGallery from '../components/SatelliteGallery';
import '../styles/Satellites.css';

class Satellites extends Component {

  render() {

    return (
      <div className="barrel-container">
        <Typography className="satellite-title" variant="display2">
          Satellite Data
        </Typography>
        <SatelliteGallery />
      </div>
    );
  }
}
export default Satellites;
