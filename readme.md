## Space Shots

### How to run
```
// start the react app and opens localhost:3000 when ready
cd frontend && npm install && npm run start

// start the backend service on localhost:4000 for http and localhost:5000 for ws
cd ../backend && npm install && npm run start
```
A future improvement would be to build a production bundle and host it via Express

### Layout
The react app has three screens:
- Data Upload: has a drag and drop file interface for loading JSON
- Satellites: a card-based dashboard showing satellites connected and sending telemetry
- Barrels: a table-based dashboard that is sortable and filterable

### API Endpoints and Actions
- `/uploadData`: HTTP POST for uploading JSON files.
- `getData`: Socket action for letting the front-end get an immediate dump of telemetry
- `deorbit`: Socket action representing the intent to deorbit a satellite
- `detonate`: Socket action for immediate destruction of a satellite
- `connect-response`: Socket message sent to clients after a successful connection
- `initial-data-load`: Socket message sent on a fresh connection containing current telemetry state
- `telemetry-update`: Socket message broadcast to all connected clients once a new telemetry json has been processed.


### Libraries Used
- Express: Quick HTTP server framework for node.js
- Immutable.js: Immutable objects preventing mutation of state outside of discrete action handlers
- Material-UI: React Component Library for tables, cards, buttons, and overall styling
- Moment.js: For time formatting in the dashboard
- Axios/reconnecting-websocket/ws: Networking libraries
- React: UI framework
- create-react-app: solved the boilerplate of setting up build pipelines.
- Redux: Central state framework with redux-thunk for action generators
- React Router: First-class support for rendering components and enabling browser history in a Single-Page Application
- Drop-Zone: Drag-and-Drop file uploader
- Keymirror: Library for making objects where keys and values are identical strings. Used for enums
