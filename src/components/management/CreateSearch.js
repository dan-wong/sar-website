import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TitleBar from '../common/TitleBar';
import AutoSuggestName from '../autoSuggest/AutoSuggestName';
import Button from '@material-ui/core/Button';
import DnDApp from '../dragAndDrop/DragAndDropApp';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing.unit,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
  pStyle: {
    fontSize: '45px',
    textAlign: 'center',
    color: 'darkBlue'
  },
  toolbar: theme.mixins.toolbar,
});

function generateRanges(max) {
  let ranges = new Array(20);
  for (var i = 1; i <= max; i++) {
    ranges[i] = { value: i, label: i };
  }
  return ranges;
}

const ranges = generateRanges(10);

class CreateSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      numberOfGroups: 3,
      password: '',
      weight: '',
      showPassword: false,
    };
  }



  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleAddGroup = () => {
    const newNumber = this.state.numberOfGroups + 1;
    this.setState({ numberOfGroups: newNumber });
  }

  handleAddPerson = () => {
    //LETS
  }


  render() {
    const { classes } = this.props;

    return (
      <div>
        <div>
          <TitleBar />
          <div className={classes.toolbar} />
          <h1 className={classes.pStyle}>Create a Search</h1>
        </div>
        <Paper style={{ margin: "2%", padding: "2%"}}>

          <div className={classes.root}>


            <TextField
              label="Search name"
              id="name"
              className={classNames(classes.margin, classes.textField)}
              onChange={this.handleChange('searchName')}
            />

          </div>
          <div>
            <AutoSuggestName />
            <Button variant="contained" color="primary" className={classes.button}
              onClick={() => this.handleAddPerson()}>
              Add person
            </Button>
            <Button variant="contained" color="primary" className={classes.button}
              onClick={() => this.handleAddGroup()}>
              Add group
            </Button>
          </div>
          <DnDApp numberOfGroups={this.state.numberOfGroups} />
        </ Paper>
      </div>
        );
  }
}

export default withStyles(styles)(CreateSearch);


