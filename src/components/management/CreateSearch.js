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
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TitleBar from '../common/TitleBar';
import DnDApp from '../dragAndDrop/DragAndDropApp';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
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
  for (var i = 1; i <= max ; i++) {
    ranges[i] = {value: i, label: i};
  }
  return ranges;
}

const ranges = generateRanges(10);

class CreateSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchName:'',
      numberOfGroups: 3,
      password: '',
      weight: '',
      showPassword: false,
    };
  }



  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div>
          <TitleBar />
          <div className={classes.toolbar} />
          <h1 className={classes.pStyle}>Create a search</h1>
        </div>

        <div className={classes.root}>

          <TextField
            label="Search name"
            id="name"
            className={classNames(classes.margin, classes.textField)}
            onChange={this.handleChange('searchName')}
          />

          <TextField
            select
            label="Number of groups"
            className={classNames(classes.margin, classes.textField)}
            value={this.state.numberOfGroups}
            onChange={this.handleChange('numberOfGroups')}
          >
            {ranges.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <FormControl fullWidth className={classes.margin}>
            <InputLabel htmlFor="adornment-amount">Amount</InputLabel>
            <Input
              id="adornment-amount"
              value={this.state.amount}
              onChange={this.handleChange('amount')}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
          </FormControl>
          <FormControl
            className={classNames(classes.margin, classes.withoutLabel, classes.textField)}
            aria-describedby="weight-helper-text"
          >
            <Input
              id="adornment-weight"
              value={this.state.weight}
              onChange={this.handleChange('weight')}
              endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
              inputProps={{
                'aria-label': 'Weight',
              }}
            />
            <FormHelperText id="weight-helper-text">Weight</FormHelperText>
          </FormControl>
          <FormControl className={classNames(classes.margin, classes.textField)}>
            <InputLabel htmlFor="adornment-password">Password</InputLabel>
            <Input
              id="adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.password}
              onChange={this.handleChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
          <DnDApp numberOfGroups={this.state.numberOfGroups}/>
      </div>
    );
  }
}

export default withStyles(styles)(CreateSearch);


