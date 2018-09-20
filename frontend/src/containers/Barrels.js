import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import BarrelTable from '../components/BarrelTable';
import '../styles/Barrel.css'

class Barrels extends Component {

  render() {

    return (
      <div className="barrel-container">
        <Typography className="data-title" variant="display2">
          Barrel Data
        </Typography>
        <BarrelTable />
      </div>
    );
  }
}

export default Barrels;