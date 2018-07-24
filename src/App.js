import React, { Component } from 'react';

import SARMap from './components/map/SARMap';
import SarAppBar from './components/appbar/SarAppBar';

import API from './api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
    }
  }

  getUrlParams(param) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var query = url.searchParams.get(param);
    return query;
  }

  componentDidMount() {
    var groupID = this.getUrlParams("groupID");
    var personID = this.getUrlParams("personID");

    if (groupID == null) {
      groupID = 1;
    }

    if (personID == null) {
      personID = 1;
    }

    let currentComponent = this;
    API.getSearchTrack(groupID, personID).then(function(response) {
      var markersList = [];

      for (var i=0; i<response.length; i++) {
        markersList.push(response[i]);
      }

      currentComponent.setState({
        markers: markersList,
      });
    })
  }

  render() {
    // if (this.state.markers && this.state.markers.length > 0) {
    //   return (
    //     <SarAppBar>
    //       <SARMap markers={this.state.markers} />
    //     </SarAppBar>
    //   )
    // } else {
    //   return (<h1>Loading...</h1>)
    // }
    return (
      <SarAppBar>
        <SARMap markers={this.state.markers} />
      </SarAppBar>
    )
  }
}

export default App;
