import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { renderComponent } from 'recompose';
import { getAllSearches } from '../../api';

export default class SARWelcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searches: []
    };
  }

  componentDidMount() {
    let currentComponent = this;
    getAllSearches().then(function (response) {
      var searchList = [];

      for (var i = 0; i < response.length; i++) {
        searchList.push(response[i]);
      }

      currentComponent.setState({
        searches: searchList,
      });
      console.log(searchList);
    })
  }

  render() {
    const pStyle = {
      fontSize: '45px',
      textAlign: 'center',
      color: 'darkBlue'
    }

    return (
      <div>
        <h1 style={pStyle}>Search And Rescue Home</h1>
        <Paper style={{ margin: "5%" }}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell numeric>ID</TableCell>
                <TableCell >Name of search</TableCell>
                <TableCell numeric >Number of groups</TableCell>
                <TableCell numeric>Number of searchers</TableCell>
                <TableCell >Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.searches.map(search => {
                return (
                  <TableRow key={search.id}>
                    <TableCell numeric >{search.id}</TableCell>
                    <TableCell component="a" href="google.com" scope="row">
                      {search.name}
                    </TableCell>
                    <TableCell numeric >1</TableCell>
                    <TableCell numeric>1</TableCell>
                    <TableCell >{search.pin}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}


