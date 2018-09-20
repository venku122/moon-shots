import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import Immutable from 'immutable';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import TableHeader from './TableHeader';
import BarrelToolbar from './Toolbar';


function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function rowSort(map, comparator) {
  return map.sort((a, b) => {
    const order = comparator(a, b);
     return order;
  });
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'barrel_id', numeric: false, disablePadding: true, label: 'Barrel ID' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'errors', numeric: false, disablePadding: false, label: 'Errors' },
  { id: 'last_flavor_sensor_result', numeric: false, disablePadding: false, label: 'Flavor State' },
  { id: 'lastUpdated', numeric: false, disablePadding: false, label: 'Last Updated' }
];

class BarrelTable extends Component {

  constructor(props) {
    super(props);

    this.state = {
      order: 'asc',
      orderBy: 'barrel_id',
      filteredResults: props.satelliteBarrels,
      searchString: '',
    };

    this.handleSearchInput = this.handleSearchInput.bind(this);
  }

  // if satelliteBarrels is updated, re-run the filter
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.satelliteBarrels.size !== this.props.satelliteBarrels.size) {
      this.handleSearchInput({target: { value: this.state.searchString}}); // match signature of onChange event
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSearchInput(evt) {
    const { satelliteBarrels } = this.props;
    console.log(evt.target.value)
    const searchString = evt.target.value;
    if (searchString === '') {
      this.setState({
        filteredResults: satelliteBarrels,
        searchString,
      });
      return;
    }
    const filteredResults = satelliteBarrels.filter((barrel => {

      // status, error state, and flavor result
      if (barrel.status.toLowerCase().includes(searchString)) {
        return true;
      }

      if (barrel.last_flavor_sensor_result.toLowerCase().includes(searchString)) {
        return true;
      }

      let hasError = false;
      barrel.errors.forEach(error => {
        if (error.toLowerCase().includes(searchString)) {
          hasError = true;
        };
      });
      if (hasError) {
        return true;
      }

      return false;
    }));

    this.setState({
      filteredResults,
      searchString
    });
  }

  renderErrors(errors) {

    return (
      <div>
        {errors.map((error) => {
          return (
            <Chip
              label={error}
              key={error}
            />
          );
        })}
      </div>
    )
  }

  renderTimeSinceLastUpdate(utcTime) {
    return moment.utc(utcTime).fromNow(); 
  }

  render() {
    const { order, orderBy, filteredResults } = this.state;

    return (
      <Paper className="root">
        <BarrelToolbar
          handleSearchInput={this.handleSearchInput}
        />
        <div className="tableWrapper">
          <Table className="table" aria-labelledby="tableTitle">
            <TableHeader
              order={order}
              orderBy={orderBy}
              rows={rows}
              handleRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {rowSort(filteredResults, getSorting(order, orderBy))
                .valueSeq().map(n => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={n.barrel_id}
                    >
                      <TableCell >{n.barrel_id}</TableCell>
                      <TableCell >{n.status}</TableCell>
                      <TableCell >{this.renderErrors(n.errors)}</TableCell>
                      <TableCell >{n.last_flavor_sensor_result}</TableCell>
                      <TableCell >{this.renderTimeSinceLastUpdate(n.lastUpdated)}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    );
  }
}

BarrelTable.propTypes = {
  satelliteBarrels: PropTypes.instanceOf(Immutable.Map).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    satelliteBarrels: state.appState.get('satelliteBarrels'),
  };
};

export default withRouter(connect(mapStateToProps)(BarrelTable));