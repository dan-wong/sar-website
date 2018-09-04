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
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    '&:hover': {
      backgroundColor: '#F64C72',
    }
  },
  pStyle: {
    fontSize: '45px',
    textAlign: 'center',
    color: '#4155B0'
  },
  toolbar: theme.mixins.toolbar,
  progress: {
    margin: theme.spacing.unit * 2,
  },
  progressContainer: {
    justifyContent: 'center',
    display: 'flex',
  }
});

class SARWelcome extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searches: [],
      inProgress: true,
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
        inProgress: false,
      });
    })
  }

  render() {
    const { classes } = this.props;
    const { inProgress } = this.state;

    let tableDisplayed = {};
    if (inProgress) {
      tableDisplayed =
        <div className={classes.progressContainer}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
    }
    else {
      tableDisplayed =
        <SearchTable searches={this.state.searches} parent={"SARWelcome"}>
        </SearchTable>
    }

    return (
      <div>
        <TitleBar />
        <div className={classes.toolbar} />
        <h1 className={classes.pStyle}>Search And Rescue Home</h1>
        <Paper style={{ margin: "5%" }}>
          <Button variant="contained" color="primary" className={classes.button}
            onClick={() => window.location = `${window.location}manage/`}>
            Manage searches
          </Button>
          {tableDisplayed}
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(SARWelcome);


