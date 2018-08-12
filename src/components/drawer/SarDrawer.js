import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import TitleBar from '../common/TitleBar';
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
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    markers: PropTypes.array,
    groups: PropTypes.array
  }

  static defaultProps = {
    styles: theme => ({
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
      toolbar: theme.mixins.toolbar,
    })
  }

  updateValues = () => {
    this.setState({
      maxaccuracy: Number(maxaccuracy),
      maxspeed: Number(maxspeed),
      visibility: Number(visibility)
    });
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, markers, title } = this.props;

    const groups = this.props.groups.map(function(group) {
      return (
        <ListItem>
          <Checkbox />
          <ListItemText primary={group.name} secondary={`Group ID: ${group.id}`}/>
        </ListItem>
      );
    });

    return (
      <div className={classes.root}>
       <TitleBar />
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
          {groups}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <SARMap 
          markers={markers} 
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