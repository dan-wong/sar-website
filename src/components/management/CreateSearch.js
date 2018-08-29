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

function generateColumns(numberOfGroups) {
  let columns = {};
  for (var i = 1; i <= numberOfGroups; i++) {
    columns["group" + i] = {
        id: "group" + i,
        name: 'gee',
        personIds: [],
    };
  }
  return columns;
}

function createInitialData(numberOfGroups) {
  let columns = generateColumns(numberOfGroups);

  let arrayOfAllColumns = [];
  for (var i = 1; i <= numberOfGroups; i++) {
      arrayOfAllColumns[i-1] = 'group' + i;
  }

  const initialData = {
      persons: {
          'person1': {id: 'person1', name: "hi1"},
          'person2': {id: 'person2', name: "hi2"},  
      },
      columns: columns,
  
      columnOrder: arrayOfAllColumns,
  }

  initialData.columns.group1.personIds = ['person1', 'person2'];

  return initialData;
}

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
      dndData: createInitialData(3),
    };

    this.onDragEnd = this.onDragEnd.bind(this);
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

  onDragEnd (result) {
    // document.body.style.color = 'inherit';
    // document.body.style.backgroundColor = 'inherit';

    const { destination, source, draggableId } = result;

    if (!destination) {
        return;
    }

    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
        return;
    }



    const start = this.state.dndData.columns[source.droppableId];
    const finish = this.state.dndData.columns[destination.droppableId];

    if (start === finish) {
        const newPersonIds = Array.from(start.personIds);
        newPersonIds.splice(source.index, 1);
        newPersonIds.splice(destination.index, 0, draggableId);

        const newColumn = {
            ...start,
            personIds: newPersonIds,
        };

        const newDndData = {
            ...this.state.dndData,
            columns: {
                ...this.state.dndData.columns,
                [newColumn.id]: newColumn,
            },
        };
        this.setState({dndData: newDndData});
        return;
    }

    //Moving from one list to another
    const startPersonIds = Array.from(start.personIds);
    startPersonIds.splice(source.index, 1);
    const newStart = {
        ...start,
        personIds: startPersonIds,
    }
    const finishPersonIds = Array.from(finish.personIds);
    finishPersonIds.splice(destination.index, 0, draggableId)

    const newFinish = {
        ...finish,
        personIds:finishPersonIds
    }

    const newDndData = {
        ...this.state.dndData,
        columns: {
            ...this.state.dndData.columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish,
        },
    }
    this.setState({dndData: newDndData});
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
          <DnDApp dndData={this.state.dndData} onDragEnd={this.onDragEnd}/>
        </ Paper>
      </div>
        );
  }
}

export default withStyles(styles)(CreateSearch);


