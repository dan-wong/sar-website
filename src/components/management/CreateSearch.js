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

function createInitialData() {

  let arrayOfAllColumns = ['group1'];

  let column = {
    id: "group1",
    name: 'unassigned',
    personIds: [],
  }

  const initialData = {
    persons: {

    },
    columns: {
      group1: column
    },

    columnOrder: arrayOfAllColumns,
  }

  initialData.columns.group1.personIds = [];

  return initialData;
}

class CreateSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchName: '',
      name: '',
      dndData: createInitialData(),
    };
  }



  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleAddPerson = () => {
    if (this.state.name === '') {
      return;
    }
    const oldPersons = this.state.dndData.persons;

    const newKeyName = "person" + (Object.keys(oldPersons).length + 1);
    const newPerson = {
      id: newKeyName,
      name: this.state.name
    }
    const newPersons = {
      ...this.state.dndData.persons,
      [newKeyName]: newPerson
    }

    const unassignedPersons = Array.from(this.state.dndData.columns['group1'].personIds);
    unassignedPersons.push(newKeyName);

    const newDndData = {
      ...this.state.dndData,
      persons: newPersons,
      columns: {
        ...this.state.dndData.columns,
        group1: {
          ...this.state.dndData.columns.group1,
          personIds: unassignedPersons
        }
      }
    }
    this.setState({ dndData: newDndData });
  }

  handleAddGroup() {
    const oldColumns = this.state.dndData.columns;

    const newColumnKey = "group" + (Object.keys(oldColumns).length + 1);
    const newColumn = {
      id: newColumnKey,
      name: 'new group',
      personIds: [],
    }

    const newColumnOrder = Array.from(this.state.dndData.columnOrder);
    newColumnOrder.push(newColumnKey);

    const newDndData = {
      ...this.state.dndData,
      columnOrder: newColumnOrder,
      columns: {
        ...this.state.dndData.columns,
        [newColumnKey]: newColumn
      }
    }

    this.setState({ dndData: newDndData });
  }

  handleNameEntry = (name) => {
    this.setState({ name: name });
  }

  handleGroupNameChange = (groupKey, newName) =>  {
    const newGroup = {
      ...this.state.dndData.columns[groupKey],
      name: newName,
    }



    const newDndData = {
      ...this.state.dndData,
      columns: {
        ...this.state.dndData.columns,
        [groupKey]: newGroup
      }
    }

    this.setState({ dndData: newDndData });
  }

  onDragEnd = (result) => {
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
      this.setState({ dndData: newDndData });
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
      personIds: finishPersonIds
    }

    const newDndData = {
      ...this.state.dndData,
      columns: {
        ...this.state.dndData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }
    this.setState({ dndData: newDndData });
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
        <Paper style={{ margin: "2%", padding: "2%" }}>

          <div className={classes.root}>


            <TextField
              label="Search name"
              id="name"
              className={classNames(classes.margin, classes.textField)}
              onChange={this.handleChange('searchName')}
            />

          </div>
          <div>
            <AutoSuggestName name={this.state.name} handleNameEntry={this.handleNameEntry} />
            <Button variant="contained" color="primary" className={classes.button}
              onClick={() => this.handleAddPerson()}>
              Add person
            </Button>
            <Button variant="contained" color="primary" className={classes.button}
              onClick={() => this.handleAddGroup()}>
              Add group
            </Button>
          </div>
          <DnDApp
            dndData={this.state.dndData}
            onDragEnd={this.onDragEnd}
            handleGroupNameChange={this.handleGroupNameChange}
          />
        </ Paper>
      </div>
    );
  }
}

export default withStyles(styles)(CreateSearch);


