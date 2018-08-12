import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TitleBar from '../common/TitleBar';
import { renderComponent } from 'recompose';
import { getAllSearches } from '../../api';
import SearchTable from './SearchTable';


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  pStyle: {
    fontSize: '45px',
    textAlign: 'center',
    color: 'darkBlue'
  },
  toolbar: theme.mixins.toolbar,
});

class SARWelcome extends React.Component {
  
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
    const { classes } = this.props;

    return (
      <div>
        <TitleBar />
       <div className={classes.toolbar} />
        <h1 className={classes.pStyle}>Search And Rescue Home</h1>
        <Paper style={{ margin: "5%" }}>
          <SearchTable searches={this.state.searches} >
          </SearchTable>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SARWelcome);


