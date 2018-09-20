const express = require('express')
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const Immutable = require('immutable');

const app = express();
const port = process.env.PORT ? proces.env.PORT : 4000;

const wss = new WebSocket.Server({ port: 5000 });
 
let satelliteBarrels = Immutable.Map(); // in-memory store of telemetry data


const sendSocketUpdate = () => { // broadcasts to any connected socket client
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        action: 'telemetry-update',
        satelliteBarrels: satelliteBarrels.toJS(),
      }));
    }
  });
};


const setupSocketHandlers = (ws) => {
  console.log('client connected');

  const handleIncomingMessage = (message) => {
    console.log('received: %s', message);

    const { action, satellite_id } = message;

    switch (action) {
      case 'getData':
        return ws.send(JSON.stringify({
          action: 'getData-response',
          satelliteBarrels: satelliteBarrels.toJS(),
        }));
      case 'deorbit':
        console.log(`Satellite ${satellite_id} told to deorbit`);
        break;
      case 'detonate':
        console.log(`Satellite ${satellite_id} immediately detonated!`);
        break;
      default:
        return;
    }
  };

  const handleDisconnect = () => {
    console.log('client disconnected');
  }

  ws.on('message', handleIncomingMessage);
  ws.on('close', handleDisconnect);
  ws.send(JSON.stringify({
    action: 'connect-response',
    message: 'Connected to the Space Taps telemtry server'
  }));
  ws.send(JSON.stringify({
    action: 'initial-data-load',
    satelliteBarrels: satelliteBarrels.toJS(),
  }));
}
wss.on('connection', setupSocketHandlers);


// Express setup
// middleware like the one below could be used for adding auth or generic error handling
app.use(bodyParser.json()); // used to handle json telemetry dumps

app.use(function(req, res, next) { // allows file uploads locally when servers are on different ports
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const updateBarrelList = (telemetryPacket) => {
  const { barrels, telemetry_timestamp, satellite_id } = telemetryPacket;

  // extract array of barrels and convert to map
  // add satellite_id and last_updated as metadata to each barrel
  for (let i = 0; i < barrels.length; i++) {
    const activeBarrel = barrels[i];
    const { barrel_id } = activeBarrel;

    if (satelliteBarrels.has(barrel_id)) {
      satelliteBarrels = satelliteBarrels.update(`${barrel_id}`, {
        ...activeBarrel,
        lastUpdated: telemetry_timestamp,
        satellite_id,
      });
    } else {
      satelliteBarrels = satelliteBarrels.set(`${barrel_id}`, {
        ...activeBarrel,
        lastUpdated: telemetry_timestamp,
        satellite_id,
      });
    }
  }
}

const handleTelemetryLink = (req, res) => {
  if (!req.body) {
    res.sendStatus(400); // if no actual file, exit early
  }
  updateBarrelList(req.body); 
  sendSocketUpdate();
  res.sendStatus(200);
}

app.post('/uploadData', handleTelemetryLink);

app.listen(port, () => console.log(`Moon Shots backend is listening on port ${port}!`))
