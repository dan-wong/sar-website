import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ReactGA from 'react-ga';

import SARWelcome from './components/management/SARWelcome';
import ManageHome from './components/management/ManageHome';
import CreateSearch from './components/management/CreateSearch';
import DnDApp from './components/dragAndDrop/DragAndDropApp'
import App from './App';

class TopLevel extends Component {
  render() {
    ReactGA.initialize('UA-110966310-2');
    ReactGA.pageview(window.location.pathname + window.location.search);

    return (
      <MuiThemeProvider>
        <Router>
          <div>
            <Route exact path="/" component={SARWelcome} />
            <Route exact path="/test" component={DnDApp} />
            <Route path="/maps" component={App} />
            <Route path="/manage/createSearch" component={CreateSearch} />
            <Route exact path="/manage" component={ManageHome} />
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default TopLevel;
