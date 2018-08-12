import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactGA from 'react-ga';

import SARWelcome from './components/management/SARWelcome';
import ManageHome from './components/management/ManageHome';

class TopLevel extends Component {
  render() {
    ReactGA.initialize('UA-110966310-2');
    ReactGA.pageview(window.location.pathname + window.location.search);

    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Route exact path="/" component={SARWelcome} />
            <Route path="/maps" component={ManageHome} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default TopLevel;
