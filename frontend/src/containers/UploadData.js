import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import JSONDropper from '../components/JSONDropper';
import '../styles/UploadData.css'

class UploadData extends Component {

  render() {

    return (
      <div className="data-container">
        <Typography className="data-title" variant="display2">
          Drag and drop a JSON file here
        </Typography>
        <JSONDropper />
      </div>
    );
  }
}

export default UploadData;
