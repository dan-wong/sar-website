import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { renderComponent } from 'recompose';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { getAllSearches } from '../../api';
import SearchTable from './SearchTable';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit * 2,
  },
  pStyle: {
    fontSize: '45px',
    textAlign: 'center',
    color: 'darkBlue'
  },
  toolbar: theme.mixins.toolbar,
  
});

class ManageHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searches: [],
      tabSelected: 0 //0 = tab 1 (search), 1 = tab 2 (people)
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
      });
      console.log(searchList);
    })
  }

  render() {
    const { classes } = this.props;
    const { tabSelected } = this.state;

    let tableDisplayed = tabSelected == 0 ? <SearchTable searches={this.state.searches} /> : null;

    return (

      <div>
       <AppBar position="absolute" className={classes.appBar}>
         <Toolbar>
           <Typography variant="title" color="inherit" noWrap>
              SAR Webservice
           </Typography>
        </Toolbar>
       </AppBar>
       <div className={classes.toolbar} />
       <h1 className={classes.pStyle}>Manage Search and People</h1>
        <Paper style={{ margin: "5%" }}>
          <Tabs value={tabSelected} onChange={this.handleChange}>
            <Tab label="Search" />
            <Tab label="People" />
          </Tabs>
          <Button variant="contained" color="primary" className={classes.button}>
              Start a new search
          </Button>
          {tableDisplayed}
        </Paper >

      </div>
    );
  }
}

export default withStyles(styles)(ManageHome);