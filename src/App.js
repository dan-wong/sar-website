import React, { Component } from 'react';

import SarDrawer from './components/drawer/SarDrawer';

import API from './api';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      groups: []
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
    // API.getSearchTrack(personID, groupID).then(function(response) {
      // var markersList = [];

    //   for (var i=0; i<response.length; i++) {
    //     markersList.push(response[i]);
    //   }

      API.getPeopleInGroup(8).then((response) => {
        currentComponent.setState({
          groups: response
        });
      });

      // API.getSearchTrack(1, 5).then(function(response) {
      //   var markersList = [];
  
      //   for (var i=0; i<response.length; i++) {
      //     markersList.push(response[i]);
      //   }

      //   var temp = [];
      //   temp.push(markersList);
  
      //   currentComponent.setState({
      //     markers: temp
      //   });
      // })

      // currentComponent.setState({
      //   markers: [...currentComponent.state.markers, markersList]
      // });
    // })
  }

  render() {
    // if (this.state.markers && this.state.markers.length > 0) {
    //   return (
    //     <SarDrawer title={"SAR Webservice"} markers={this.state.markers} groups={this.state.groups}/>
    //   )
    // } else {
    //   return (<h1>Loading...</h1>)
    // }
    if (this.state.groups && this.state.groups.length > 0) {
      return (
        <SarDrawer title={"SAR Webservice"} groups={this.state.groups} groupId={8}/>
      )
    } else {
      return (<h1>Loading...</h1>)
    }
  }
}

export default App;
