import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/lab/Slider';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

import SARMap from '../map/SARMap';

import API from '../../api';

const drawerWidth = 300;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100vh',
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  toolbar: theme.mixins.toolbar,
});

var maxaccuracy = 100, maxspeed = 80, visibility = 50;

class SarDrawer extends React.Component {
  state = {
    maxaccuracy: 100,
    maxspeed: 80,
    visibility: 50,
    value: 100,
    checked: new Array(this.props.groups[0].people.length).fill(-1),
    markers: [],
    cachedMarkers: new Array(this.props.groups[0].people.length).fill([]),
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    groups: PropTypes.array,
    groupId: PropTypes.number
  }

  updateValues = () => {
    this.setState({
      maxaccuracy: Number(maxaccuracy),
      maxspeed: Number(maxspeed),
      visibility: Number(visibility)
    });
  }

  updateMap() {
    const { checked } = this.state;

    let currentComponent = this;

    var newMarkers = [];
    for (var i=0; i<checked.length; i++) {
      if (checked[i] === 1) {
        newMarkers.push(currentComponent.state.cachedMarkers[i]);
      }
    }

    this.setState({
      markers: newMarkers,
    });
  }

  handleToggle = value => () => {
    const { checked, cachedMarkers } = this.state;

    if (checked[value] === -1) {
      checked[value] = 1;
      
      let currentComponent = this;
      console.log(this.props.groups);
      API.getSearchTrack(this.props.groups[0].people[value].id, this.props.groupId).then(function(response) {
        var markersList = [];

        for (var i=0; i<response.length; i++) {
          markersList.push(response[i]);
        }

        cachedMarkers[value] = markersList;

        currentComponent.updateMap();
      });
    } else {
      checked[value] = checked[value] === 0 ? 1 : 0;
      this.updateMap();
    }
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, title } = this.props;

    let currentComponent = this;

    const groups = this.props.groups[0].people.map((person, index) => {
      return (
        <ListItem
          key={index}
          role={undefined}
          dense
          className={classes.listItem}
        >
          <Checkbox 
            // checked={currentComponent.state.checked[index] === 1}
            onClick={currentComponent.handleToggle(index)}
            disableRipple 
          />
          <ListItemText primary={`${person.firstName} ${person.lastName}`} secondary={`Person ID: ${person.id}`}/>
        </ListItem>
      );
    });

    return (
      <div className={classes.root}>
       <AppBar position="absolute" className={classes.appBar}>
         <Toolbar>
           <Typography variant="title" color="inherit" noWrap>
             {title}
           </Typography>
        </Toolbar>
       </AppBar>
       <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem>
            <Slider value={this.state.value} aria-labelledby="label" onChange={this.handleChange} />
          </ListItem>
          <ListItem>
            <TextField
              id="accuracy"
              label="Accuracy"
              className={classes.textField}
              defaultValue="100"
              margin="normal" 
              onChange={(event) => {maxaccuracy = event.target.value}}
              InputProps={{
                startAdornment: <InputAdornment position="start">m</InputAdornment>,
              }}/>

            <TextField
              id="maxspeed"
              label="Max Speed"
              className={classes.textField}
              defaultValue="80"
              margin="normal" 
              onChange={(event) => {maxspeed = event.target.value}}
              InputProps={{
                startAdornment: <InputAdornment position="start">km/h</InputAdornment>,
              }}/>
          </ListItem>
          <ListItem>
            <TextField
              id="visibility"
              label="Visibility"
              className={classes.textField}
              defaultValue="50"
              margin="normal" 
              onChange={(event) => {visibility = event.target.value}}
              InputProps={{
                startAdornment: <InputAdornment position="start">m</InputAdornment>,
              }}/>
          </ListItem>
          <ListItem>
            <Button variant="contained" color="primary" className={classes.button} onClick={() => {this.updateValues()}}>
              Update Values
            </Button>
          </ListItem>
          <ListItem>
          <ListItemText primary={"Groups"}/>
          </ListItem>
          {groups}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <SARMap 
          markers={this.state.markers} 
          maxaccuracy={this.state.maxaccuracy} 
          maxspeed={this.state.maxspeed}
          visibility={this.state.visibility}
          sliderValue={this.state.value}
        />
      </main>
    </div>
    );
  }
}

export default withStyles(styles)(SarDrawer);