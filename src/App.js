import React, { Component } from 'react';

import SARMap from './components/map/SARMap';

import API from './api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
    }
  }

  componentDidMount() {
    let currentComponent = this;
    API.getSearchTrack(1,1).then(function(response) {
      const events = JSON.parse(response);
      var markersList = [];

      for (var i=0; i<events.events.length; i++) {
        markersList.push(events.events[i]);
      }

      currentComponent.setState({
        markers: markersList,
      });
    })
  }

  render() {
    if (this.state.markers && this.state.markers.length > 0) {
      return (
        <SARMap markers={this.state.markers} />
      )
    } else {
      return (<h1>Loading...</h1>)
    }
  }
}

export default App;
