import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';

import SARMap from '../map/SARMap';

const drawerWidth = 240;

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

class SarDrawer extends React.Component {
  state = {
    filterPoints: false,
    maxaccuracy: 100,
    maxspeed: 80,
    visibility: 50
  }

  handleCheckboxChange = (name) => (event, checked) => {
    this.setState((state) => {
      return { [name]: !state[name]};
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
    markers: PropTypes.array,
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

  render() {
    const { classes, markers, title } = this.props;

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
          <ListItem button onClick={this.handleCheckboxChange('filterPoints')}>
            <Checkbox
              checked={this.state.filterPoints}
            />
            <ListItemText primary="Filter Points" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem>
            <TextField
              id="accuracy"
              label="Accuracy"
              className={classes.textField}
              defaultValue="100"
              margin="normal" 
              onChange={this.handleChange('maxaccuracy')}
              InputProps={{
                startAdornment: <InputAdornment position="start">m</InputAdornment>,
              }}/>

            <TextField
              id="maxspeed"
              label="Max Speed"
              className={classes.textField}
              defaultValue="80"
              margin="normal" 
              onChange={this.handleChange('maxspeed')}
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
              onChange={this.handleChange('visibility')}
              InputProps={{
                startAdornment: <InputAdornment position="start">m</InputAdornment>,
              }}/>
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <SARMap 
          filterPoints={this.state.filterPoints} 
          markers={markers} 
          maxaccuracy={this.state.accuracy} 
          maxspeed={this.state.maxspeed}
          visibility={this.state.visibility}
        />
      </main>
    </div>
    );
  }
}

export default withStyles(styles)(SarDrawer);