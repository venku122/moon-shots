import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import { connectSocket } from '../actions/actions';
import Header from './Header';
import Main from './Main';

class App extends Component {

  componentWillMount() {
    const { setupSocket } = this.props;
    setupSocket();
  }

  render() {
    return (
      <div>
        <Header />
        <Main />
      </div>
    );
  }
}

App.propTypes = {
  setupSocket: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setupSocket: () => {
      dispatch(connectSocket())
    }
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));
