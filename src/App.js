import React, { Component } from 'react';

import queryString from 'query-string'

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
    let searchObj = queryString.parse(this.props.location.search);
    let query = searchObj[param];
    return query;
  }

  componentDidMount() {
    var searchID = this.getUrlParams("searchID");

    console.log(searchID);

    if (searchID == null) {
      searchID = 5;
    }

    let currentComponent = this, data;
    API.getGroupsInSearch(searchID).then((response) => {
      data = response;
      data.forEach((element, index) => {
        API.getPeopleInGroup(element.id).then((response) => {
          data[index].people = response;
          currentComponent.setState({
            groups: data,
          });
        });
      });
    });
  }

  render() {
    if (this.state.groups && this.state.groups.length > 0) {
      return (
        <SarDrawer title={"SAR Webservice"} groups={this.state.groups} />
      )
    } else {
      return (<h1>Loading...</h1>)
    }
  }
}

export default App;
