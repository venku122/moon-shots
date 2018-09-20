import ReconnectingWebSocket from 'reconnecting-websocket'; // used for streaming updates
import axios from 'axios';
import Immutable from 'immutable';
import ActionTypes from './actionTypes';

const urlBase = 'http://localhost:4000';
const websocketBase = 'ws://localhost:5000'

let socket;
 
export const connectSocket = () => {
  return (dispatch) => {
    socket = new ReconnectingWebSocket(websocketBase);

    socket.addEventListener('open', () => {
      dispatch({
        type: ActionTypes.SOCKET_CONNECTED
      });
    });

    socket.addEventListener('close', () => {
      dispatch({
        type: ActionTypes.SOCKET_DISCONNECTED
      });
    });

    socket.addEventListener('message', (message) => {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message.data);
      } catch (e) {
        return dispatch({
          type: ActionTypes.INVALID_MESSAGE,
        });
      }

      switch (parsedMessage.action) {
        case 'connect-response':
          console.log(parsedMessage.message);
          break;
        case 'initial-data-load':
          return dispatch({
            type: ActionTypes.RECEIVED_INITIAL_SATELLITE_DATA,
            satelliteBarrels: Immutable.Map(parsedMessage.satelliteBarrels),
          });
        case 'telemetry-update':
        case 'getData-response':
          return dispatch({
            type: ActionTypes.SATELLITE_DATA_UPDATE,
            satelliteBarrels: Immutable.Map(parsedMessage.satelliteBarrels),
          });
        default:
          return;
      }
    });
  }
}

export const detonateSatellite = (satellite_id) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.DETONATE_SATELLITE,
    });
    socket.send(JSON.stringify({
      action: 'detonate',
      satellite_id
    }));
  };
};

export const deorbitSatellite = (satellite_id) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.DEORBIT_SATELLITE,
    });
    socket.send(JSON.stringify({
      action: 'deorbit',
      satellite_id
    }));
  };
};

export const getDataUpdate = () => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.GET_SATELLITE_DATA_UPDATE,
    });
    socket.send(JSON.stringify({
      action: 'getData',
    }));
  };
};

export const uploadJSONData = (json) => {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.UPLOAD_JSON_DATA_ATTEMPTED
    });
    let parsedJSON;
    try {
      parsedJSON = JSON.parse(json);
    } catch (e) {
      return dispatch({
        type: ActionTypes.UPLOAD_JSON_DATA_FAILED
      });
    }

    axios.post(`${urlBase}/uploadData`, parsedJSON)
    .then((res) => {
      dispatch({
        type: ActionTypes.UPLOAD_JSON_DATA_SUCCESSFUL
      });
    })
    .catch((err) => {
      dispatch({
        type: ActionTypes.UPLOAD_JSON_DATA_FAILED
      });
    })
  }
}

export const resetFileUploader = () => {
  return {
    type: ActionTypes.RESET_UPLOAD
  };
}