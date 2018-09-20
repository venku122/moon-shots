import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Barrels from './Barrels';
import UploadData from './UploadData';
import Satellites from './Satellites';


class Main extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Barrels}/>
        <Route path='/satellites' component={Satellites}/>
        <Route path='/uploadData' component={UploadData}/>
      </Switch>
    );
  }
}

export default Main;
