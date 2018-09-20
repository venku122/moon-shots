import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';

let BarrelToolbar = props => {
  const { handleSearchInput } = props;
  return (
    <Toolbar
      className="toolbar-root"
    >
      <div className="toolbar-title">
        <Typography variant="title" id="tableTitle">
          Barrels
        </Typography>
      </div>
      <div className="toolbar-spacer" />
      <div className="toolbar-actions">
        <Tooltip title="Filter list">
          <TextField
            id="text-filter"
            label="Filter"
            type="search"
            className="search-box"
            margin="normal"
            onChange={handleSearchInput}
          />
        </Tooltip>
      </div>
    </Toolbar>
  );
};

BarrelToolbar.propTypes = {
  handleSearchInput: PropTypes.func.isRequired,
};

export default BarrelToolbar;