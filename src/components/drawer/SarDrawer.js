import React from 'react';
import PropTypes from 'prop-types';

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

// function SarDrawer(props) {
//   const { classes, markers, title } = props;

//   const sarmap = <SARMap onRef={ref => (this.child = ref)} markers={markers} />
//   const checked = () => { console.log(this.child) }

//   return (
//     <div className={classes.root}>
//       <AppBar position="absolute" className={classes.appBar}>
//         <Toolbar>
//           <Typography variant="title" color="inherit" noWrap>
//             {title}
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         variant="permanent"
//         classes={{
//           paper: classes.drawerPaper,
//         }}
//       >
//         <div className={classes.toolbar} />
//         <List>
//           <ListItem button>
//             <Checkbox
//               onChange={() => { checked() }}
//               value="checked"
//             />
//             <ListItemText primary="Filter Points" />
//           </ListItem>
//         </List>
//       </Drawer>
//       <main className={classes.content}>
//         <div className={classes.toolbar} />
//         {sarmap}
//       </main>
//     </div>
//   );
// }

// SarDrawer.propTypes = {
//   classes: PropTypes.object.isRequired,
//   title: PropTypes.string.isRequired,
//   markers: PropTypes.array,
// };

export default class SarDrawer extends React.Component {
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

  checked() {
    this.child.checked();
  }

  render() {
    const { styles, markers, title } = this.props;

    const sarmap = <SARMap onRef={ref => (this.child = ref)} markers={markers} />

    return (
      <div className={styles.root}>
       <AppBar position="absolute" className={styles.appBar}>
         <Toolbar>
           <Typography variant="title" color="inherit" noWrap>
             {title}
           </Typography>
        </Toolbar>
       </AppBar>
       <Drawer
        variant="permanent"
        classes={{
          paper: styles.drawerPaper,
        }}
      >
        <div className={styles.toolbar} />
        <List>
          <ListItem button>
            <Checkbox
              onChange={() => { this.child.checked() }}
              value="checked"
            />
            <ListItemText primary="Filter Points" />
          </ListItem>
        </List>
      </Drawer>
      <main className={styles.content}>
        <div className={styles.toolbar} />
        {sarmap}
      </main>
    </div>
    );
  }
}