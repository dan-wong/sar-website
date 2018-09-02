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
    var searchID = this.getUrlParams("searchID");

    if (searchID == null) {
      searchID = 5;
    }

    let currentComponent = this, data;
    API.getGroupsInSearch(searchID).then((response) => {
      data = response;
      API.getPeopleInGroup(data[0].id).then((response) => {
        data[0].people = response;
        currentComponent.setState({
          groups: data,
        })
      });
    });
  }

  render() {
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
