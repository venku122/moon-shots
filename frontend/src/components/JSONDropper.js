import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone'
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { uploadJSONData, resetFileUploader } from '../actions/actions';

class JSONDropper extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fileString: '',
    }

    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.handleClearFile = this.handleClearFile.bind(this);
  }

  handleFileDrop(acceptedFiles) {
    console.log('drop detected')
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileAsBinaryString = reader.result;
        console.log(fileAsBinaryString);
        this.setState({
          fileString: fileAsBinaryString,
        });
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });
  }

  handleClearFile() {
    this.setState({
      fileString: '',
    });
  }

  handleUploadFile() {
    const { fileString } = this.state;
    const { uploadJSON } = this.props;

    if (fileString !== '') {
      uploadJSON(fileString);
    }
  }

  renderDropOrText() {
    const { fileString } = this.state;

    if (fileString === '') {
      return (
        <Dropzone
          className="drop-zone"
          accept="application/json"
          onDropAccepted={this.handleFileDrop}
        />
      );
    } else {
      return (
        <div className="drop-zone">
          {fileString}
        </div>
      );
    }
  }

  render() {
    const { uploadingJSON, sentJSON } = this.props;
    const { fileString } = this.state;
    return (
      <Paper className="data-drop-container" elevation={1}>
        {this.renderDropOrText()}
        <div className="data-button-row">
          <Button
            variant="contained"
            color="secondary"
            disabled={fileString === ''}
            onClick={this.handleClearFile}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={uploadingJSON || fileString === '' }
            onClick={this.handleUploadFile}
          >
            Upload
          </Button>
        </div>
        {sentJSON &&
          <Typography variant="subheading">
            Upload Successful
          </Typography>
        }
      </Paper>
    );
  }
}

JSONDropper.propTypes = {
  uploadingJSON: PropTypes.bool.isRequired,
  sentJSON: PropTypes.bool.isRequired,
  uploadJSON: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    uploadingJSON: state.appState.get('uploadingJSON'),
    sentJSON: state.appState.get('sentJSON'),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    uploadJSON: (json) => {
      dispatch(uploadJSONData(json))
    },
    resetLoader: () => {
      dispatch(resetFileUploader());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JSONDropper);
