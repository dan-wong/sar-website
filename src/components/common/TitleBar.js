import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    cursor: 'pointer',
  }
});

class TitleBar extends Component {
  render() {
    const { classes } = this.props;

    return (
       <AppBar position="absolute" className={classes.appBar} 
            onClick={() => window.location = `${window.location.origin}`} >
         <Toolbar>
           <Typography variant="title" color="inherit" noWrap>
             Search and Rescue (Web App)
           </Typography>
        </Toolbar>
       </AppBar>
    );
  }
}

export default withStyles(styles)(TitleBar);
