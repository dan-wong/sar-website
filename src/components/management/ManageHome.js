import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { renderComponent } from 'recompose';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TitleBar from '../common/TitleBar';
import { getAllSearches } from '../../api';
import SearchTable from './SearchTable';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit * 2,
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

class ManageHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searches: [],
      tabSelected: 0, //0 = tab 1 (search), 1 = tab 2 (people)
      inProgress: true,
    };
  }

  handleChange = (event, tabSelected) => {
    this.setState({ tabSelected });
  };

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
      console.log(searchList);
    })
  }

  render() {
    const { classes } = this.props;
    const { tabSelected, inProgress } = this.state;

    let tableDisplayed = {};
    if (inProgress) {
      tableDisplayed =
        <div className={classes.progressContainer}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
    }
    else if (tabSelected == 0) {
      tableDisplayed = <SearchTable searches={this.state.searches} parent={"ManageHome"} />
    }
    else {
      tableDisplayed = null;
    }

    return (

      <div>
        <TitleBar />
        <div className={classes.toolbar} />
        <h1 className={classes.pStyle}>Manage Search and People</h1>
        <Paper style={{ margin: "5%" }}>
          <Tabs value={tabSelected} onChange={this.handleChange}>
            <Tab label="Search" />
            <Tab label="People" />
          </Tabs>
          <Button variant="contained" color="primary" className={classes.button}
            onClick={() => window.location = `${window.location}createSearch/`}>
            Start a new search
          </Button>
          {tableDisplayed}
        </Paper >

      </div>
    );
  }
}

export default withStyles(styles)(ManageHome);