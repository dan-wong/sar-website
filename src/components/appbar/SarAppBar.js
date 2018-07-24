import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import styles from './SarAppBar.css';

export default class SarAppBar extends React.Component {
  static propTypes = {
    title: PropTypes.string,
  }

  static defaultProps = {
    title: "SAR Webservice"
  }
  
  render() {
    const { title } = this.props;
    return (
      <div className={styles.root}>
        <AppBar position="static">
          <Toolbar>
          <Typography variant="title" color="inherit">
              {title}
          </Typography>
          </Toolbar>
        </AppBar>
        {this.props.children}
      </div>
    )
  }
}