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
    checked: new Array(this.props.groups.length).fill(-1),
    markers: [],
    cachedMarkers: new Array(this.props.groups.length).fill([]),
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

  handleToggle = value => () => {
    const { checked, cachedMarkers } = this.state;

    if (checked[value] === -1) {
      checked[value] = 1;

      API.getSearchTrack(this.props.groups[value].id, this.props.groupId).then(function(response) {
        var markersList = [];

        for (var i=0; i<response.length; i++) {
          markersList.push(response[i]);
        }

        cachedMarkers[value] = markersList;
      });
    } else {
      checked[value] = checked[value] === 0 ? 1 : 0;
    }

    var newMarkers = [];
    let currentComponent = this;

    checked.forEach((value) => {
      if (value === 1) {
        newMarkers.push(currentComponent.state.cachedMarkers[value]);
      }
    });

    this.setState({
      markers: newMarkers,
    });

    console.log(this.state);

    // const currentIndex = checked.indexOf(value);
    // const newChecked = [...checked];

    // if (currentIndex === -1) {
    //   newChecked.push(value);
    // } else {
    //   newChecked.splice(currentIndex, 1);
    // }

    // this.setState({
    //   checked: newChecked
    // });
    
    // let currentComponent = this;
    // if (currentIndex === -1) {
    //   if (typeof this.state.cachedMarkers[value] != 'undefined') {
    //     currentComponent.setState({
    //       markers: [...currentComponent.state.markers, currentComponent.state.cachedMarkers[value]]
    //     })
    //   } else { // Person has not been selected before
    //     API.getSearchTrack(value, this.props.groupId).then(function(response) {
    //       var markersList = [];
    
    //       for (var i=0; i<response.length; i++) {
    //         markersList.push(response[i]);
    //       }

    //       var tempCachedMarkers = currentComponent.state.cachedMarkers;
    //       tempCachedMarkers[value] = markersList;
    
    //       currentComponent.setState({
    //         markers: [...currentComponent.state.markers, markersList],
    //         cachedMarkers: tempCachedMarkers
    //       });
    //     });
    //   }
    // } else {
    //   var newMarkers = [];
    //   newChecked.forEach((value) => {
    //     if (value != 0) {
    //       newMarkers.push(currentComponent.state.cachedMarkers[value]);
    //     }
    //   });

    //   currentComponent.setState({
    //     markers: newMarkers,
    //   })
    // }
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, title } = this.props;

    let currentComponent = this;

    const groups = this.props.groups.map((group, index) => {
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
          <ListItemText primary={`${group.firstName} ${group.lastName}`} secondary={`Person ID: ${group.id}`}/>
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