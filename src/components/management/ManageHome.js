import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { renderComponent } from 'recompose';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TitleBar from '../common/TitleBar';
import { getAllSearches, getAllPersons, getAllSearchesWithCount } from '../../api';
import SearchTable from './SearchTable';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import PeopleTable from './PeopleTable';

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
  },
  tableContainer: {
    margin: '0% 10%',
  }
});

class ManageHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searches: [],
      persons: [],
      tabSelected: 0, //0 = tab 1 (search), 1 = tab 2 (people)
      inProgress: 0, //0 = loading both, 1 = loaded one, 2 = loaded both
    };
  }

  handleChange = (event, tabSelected) => {
    this.setState({ tabSelected });
  };

  componentDidMount() {
    let currentComponent = this;
    getAllPersons().then(response => {
      //Sort according to id
      response.sort((thisPerson, otherPerson) => {
        return thisPerson.id - otherPerson.id;
      });;
      currentComponent.setState({
        inProgress: currentComponent.state.inProgress + 1,
        persons: response,
      });
    });
    getAllSearchesWithCount().then(function (response) {
      //Sort according to id
      response.sort((thisSearch, otherSearch) => {
        return thisSearch.id - otherSearch.id;
      });;
      var searchList = [];

      for (var i = 0; i < response.length; i++) {
        searchList.push(response[i]);
      }

      currentComponent.setState({
        searches: searchList,
        inProgress: currentComponent.state.inProgress + 1,
      });
      console.log(searchList);
    });
  }

  render() {
    const { classes } = this.props;
    const { tabSelected, inProgress } = this.state;

    let tableDisplayed = {};
    if (inProgress !== 2) { //2 means loaded both
      tableDisplayed =
        <div className={classes.progressContainer}>
          <CircularProgress className={classes.progress} size={50} />
        </div>
    }
    else if (tabSelected == 0) {
      tableDisplayed = <SearchTable searches={this.state.searches} parent={"ManageHome"} />
    }
    else {
      tableDisplayed = <PeopleTable persons={this.state.persons} />
    }

    return (

      <div>
        <TitleBar />
        <div className={classes.toolbar} />
        <h1 className={classes.pStyle}>Manage Search and People</h1>
        <div className={classes.tableContainer}>
          <Paper style={{ margin: "5%" }} >
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
      </div>
    );
  }
}

export default withStyles(styles)(ManageHome);