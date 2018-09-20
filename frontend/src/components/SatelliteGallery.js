import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
  detonateSatellite,
  deorbitSatellite,
} from '../actions/actions';
import SatelliteCard from './SatelliteCard';

function SatelliteGallery(props) {
  const {
    satelliteBarrels,
    handleDetonateSatellite,
    handleDeorbitSatellite
  } = props;

  let satellites = Immutable.Map();

  // Map is used to iterate through the barrels
  // eslint-disable-next-line
  satelliteBarrels.map(barrel => {
    satellites = satellites.set(barrel.satellite_id, barrel.satellite_id);
  })

  return (
    <div className="satellites-root">
      {satellites.valueSeq().map((satellite) => {
        return (
          <SatelliteCard
            satellite_id={satellite}
            key={satellite}
            handleDetonate={handleDetonateSatellite}
            handleDeorbit={handleDeorbitSatellite}
          />
        );
      })}
    </div>
  );
}

SatelliteGallery.propTypes = {
  satelliteBarrels: PropTypes.instanceOf(Immutable.Map).isRequired,
  handleDetonateSatellite: PropTypes.func.isRequired,
  handleDeorbitSatellite: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    satelliteBarrels: state.appState.get('satelliteBarrels'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleDeorbitSatellite: (satellite_id) => {
      dispatch(deorbitSatellite(satellite_id))
    },
    handleDetonateSatellite: (satellite_id) => {
      dispatch(detonateSatellite(satellite_id))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SatelliteGallery);
