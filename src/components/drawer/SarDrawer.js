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
import ListSubheader from '@material-ui/core/ListSubheader';

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
    maxaccuracy: 50,
    maxspeed: 10,
    visibility: 20,
    value: 100,
    checked: new Array(this.countPeople(this.props.groups)).fill(-1),
    markers: [],
    cachedMarkers: new Array(this.countPeople(this.props.groups)).fill([]),
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    groups: PropTypes.array,
  }

  countPeople(groups) {
    var count = 0;
    for (var i=0; i<groups.length; i++) {
      if (groups[i].people != null) {
        count += groups[i].people.length;
      }
    }
    return count;
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

      console.log(value);
      
      let currentComponent = this;
      API.getSearchTrack(this.props.groups[0].people[value].id, this.props.groups[0].id).then(function(response) {
        var markersList = [];

        for (var i=0; i<response.length; i++) {
          markersList.push(response[i]);
        }

        console.log(markersList);

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
    var counter = -1;
    const groups = this.props.groups.map((group, groupIndex) => {
      if (group.people != null) {
        const people = group.people.map(person => {
          counter++;
          return (
            <ListItem
              key={counter}
              role={undefined}
              dense
              className={classes.listItem}
            >
              <Checkbox 
                onClick={currentComponent.handleToggle(counter)}
                disableRipple 
              />
              <ListItemText primary={`${person.firstName} ${person.lastName}`} secondary={`Person ID: ${person.id}`}/>
            </ListItem>
          );
        });
        return (
          <div key={group.id + 100}>
            <ListSubheader key={group.id}>{`Group ID ${group.id}`}</ListSubheader>
            {people}
          </div>
        );
      }
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
            <ListItemText primary={"Filtering Options"}/>
          </ListItem>
          <ListItem>
            <TextField
              id="accuracy"
              label="Accuracy"
              className={classes.textField}
              defaultValue="50"
              margin="normal" 
              onChange={(event) => {maxaccuracy = event.target.value}}
              InputProps={{
                startAdornment: <InputAdornment position="start">m</InputAdornment>,
              }}/>

            <TextField
              id="maxspeed"
              label="Max Speed"
              className={classes.textField}
              defaultValue="10"
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
              defaultValue="20"
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
            <div style={{width: '90%'}}>
              <Typography>
                Time Slider
              </Typography>
              <Slider value={this.state.value} onChange={this.handleChange} />
            </div>
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