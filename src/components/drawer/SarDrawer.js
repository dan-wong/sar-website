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
  toolbar: theme.mixins.toolbar,
});

class SarDrawer extends React.Component {
  state = {
    filterPoints: false,
  }

  handleChange = (name) => (event, checked) => {
    this.setState((state) => {
      return { [name]: !state[name]};
    })
  }

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
          <ListItem button onClick={this.handleChange('filterPoints')}>
            <Checkbox
              checked={this.state.filterPoints}
            />
            <ListItemText primary="Filter Points" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <SARMap filterPoints={this.state.filterPoints} markers={markers} />
      </main>
    </div>
    );
  }
}

export default withStyles(styles)(SarDrawer);