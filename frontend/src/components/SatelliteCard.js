import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';


function SatelliteCard(props) {

  const {
    satellite_id,
    handleDetonate,
    handleDeorbit
  } = props;
  return (
    <Card className="satellite-card">
      <CardContent>
        <Typography className="satellite-card-title" color="textSecondary">
          Satellite Info
        </Typography>
        <Typography className="satellite-card-pos" color="textSecondary">
          {`satellite_id: ${satellite_id}`}
        </Typography>
      </CardContent>
      <CardActions className="satellite-card-buttons">
        <Button
          color="secondary"
          size="small"
          onClick={() => handleDetonate(satellite_id)}
        >
          Detonate
        </Button>
        <Button
          size="small"
          onClick={() => handleDeorbit(satellite_id)}
        >
          Trigger Deorbit Burn
        </Button>
      </CardActions>
    </Card>
  );
}

SatelliteCard.propTypes = {
  satellite_id: PropTypes.number.isRequired,
  handleDetonate: PropTypes.func.isRequired,
  handleDeorbit: PropTypes.func.isRequired,
};

export default SatelliteCard;