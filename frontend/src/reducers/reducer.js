import ActionTypes from '../actions/actionTypes';
import Immutable from 'immutable';

const DEFAULT_STATE = Immutable.Map({
  uploadingJSON: false,
  sentJSON: false,
  satelliteBarrels: Immutable.Map(),
});


export default function reducer(state = DEFAULT_STATE, action) {
  const { type, satelliteBarrels } = action;

  switch(type) {
    case ActionTypes.UPLOAD_JSON_DATA_ATTEMPTED:
      return state.merge({
        uploadingJSON: true,
        sentJSON: false,
      });
    case ActionTypes.UPLOAD_JSON_DATA_SUCCESSFUL:
      return state.merge({
        uploadingJSON: false,
        sentJSON: true,
      });
    case ActionTypes.UPLOAD_JSON_DATA_FAILED:
    return state.merge({
      uploadingJSON: false,
      sentJSON: false,
    });
    case ActionTypes.RESET_UPLOAD:
      return state.merge({
        uploadingJSON: false,
        sentJSON: false,
      });
    case ActionTypes.RECEIVED_INITIAL_SATELLITE_DATA:
      return state.merge({
        satelliteBarrels,
      });
    case ActionTypes.SATELLITE_DATA_UPDATE:
      return state.merge({
        satelliteBarrels: state.get('satelliteBarrels').merge(satelliteBarrels)
      });
    default:
      return state;
  }
}