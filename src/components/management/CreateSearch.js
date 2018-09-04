import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import queryString from 'query-string'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { getAllPersons, postAllManagement, getFullSearch } from '../../api';
import TitleBar from '../common/TitleBar';
import AutoSuggestName from '../autoSuggest/AutoSuggestName';
import Button from '@material-ui/core/Button';
import DnDApp from '../dragAndDrop/DragAndDropApp';
import SaveIcon from '@material-ui/icons/Save';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  divFullWidth: {
    width: '100%',
    backgroundColor: '',
  },
  button: {
    margin: theme.spacing.unit,
    '&:hover': {
      backgroundColor: '#F64C72',
    }
  },
  buttonHolder: {
    justifyContent: 'flex-end',
    display: 'flex',
  },
  saveButton: {
    '&:hover': {
      backgroundColor: '#F64C72',
    }
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
    color: '#4155B0',
  },
  toolbar: theme.mixins.toolbar,

  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  progressContainer: {
    justifyContent: 'center',
    display: 'flex',
  }
});

function createInitialData() {

  let arrayOfAllColumns = ['group1'];

  let column = {
    id: "group1",
    name: 'unassigned',
    personIds: [],
    dbId: '---',
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
      searchId: 'new',
      name: '',
      dndData: createInitialData(),
      personsForSuggestion: [],
      inProgress: true,
      saveInProgress: false,
    };
  }

  getUrlParams(param) {
    let searchObj = queryString.parse(this.props.location.search);
    let query = searchObj[param];
    return query;

  }

  loadPersons() {
    let currentComponent = this;
    getAllPersons().then(function (response) {
      var personList = [];

      let personsAsSuggestions = response.map(person => {
        var personAsSuggestion = {};
        personAsSuggestion.id = person.id;
        personAsSuggestion.label = person.firstName + ' ' + person.lastName;
        return personAsSuggestion;
      });

      for (var i = 0; i < personsAsSuggestions.length; i++) {
        personList.push(personsAsSuggestions[i]);
      }

      currentComponent.setState({
        personsForSuggestion: personList,
      });
    });
  }

  loadFullSearch(searchId) {
    let currentComponent = this;
    getFullSearch(searchId).then(function (response) {
      //Create search data
      let search = response.search;
      currentComponent.setState({ searchName: search.name });
      currentComponent.setState({ searchId: "" + search.id });

      //Create group data
      let groups = response.groups;
      let columnsForDnd = {};
      let columnOrderForDnd = [];
      let groupKeyCounter = 0;
      let groupIdKeyMap = {};

      //Create the unassigned group
      let groupKey = "group" + ++groupKeyCounter;
      let groupForDnd = {
        id: "group1",
        name: 'unassigned',
        personIds: [],
        dbId: '---',
      };
      columnsForDnd = {
        ...columnsForDnd,
        [groupKey]: groupForDnd,
      };
      columnOrderForDnd.push(groupKey);

      groups.map((group) => {
        let groupKey = "group" + ++groupKeyCounter;
        let groupForDnd = {
          id: groupKey,
          name: group.name,
          dbId: "" + group.id,
          personIds: [],
        };
        columnsForDnd = {
          ...columnsForDnd,
          [groupKey]: groupForDnd,
        };
        groupIdKeyMap = {
          ...groupIdKeyMap,
          [group.id]: groupKey,
        }
        columnOrderForDnd.push(groupKey);
      });

      //Create person data
      let persons = response.persons;
      let personsForDnd = {};
      let personKeyCounter = 0;
      let personIdKeyMap = {};
      persons.map((person) => {
        let personKey = "person" + ++personKeyCounter;
        let personForDnd = {
          id: personKey,
          name: person.firstName + " " + person.lastName,
          dbId: "" + person.id,
        };
        personsForDnd = {
          ...personsForDnd,
          [personKey]: personForDnd,
        };
        personIdKeyMap = {
          ...personIdKeyMap,
          [person.id]: personKey,
        }
      });

      //push assignment data
      let assignments = response.assignments;
      let unassignedPersonIdKeyMap = Object.assign({}, personIdKeyMap); //Create a deep copy.
      assignments.map((assignment) => {
        let personId = assignment.personId;
        let groupId = assignment.groupId;
        let personKey = personIdKeyMap[personId];
        let groupKey = groupIdKeyMap[groupId];

        //Remove a person if it is assigned.
        delete unassignedPersonIdKeyMap[personId];
        console.log(unassignedPersonIdKeyMap);
        columnsForDnd[groupKey].personIds.push(personKey);
      });

      //Add all unassigned person to unassigned group
      //note: "key" here is id, "value" here is the personKey
      Object.keys(unassignedPersonIdKeyMap).map((key) => {
        let personKey = unassignedPersonIdKeyMap[key];
        //Group 1 is the unassigned group
        columnsForDnd.group1.personIds.push(personKey);
      });

      let newDndData = {
        persons: personsForDnd,
        columns: columnsForDnd,
        columnOrder: columnOrderForDnd
      };
      currentComponent.setState(
        {
          dndData: newDndData,
          inProgress: false
        });
    });
  }

  componentDidMount() {
    this.loadPersons();
    let searchId = this.getUrlParams("searchId");
    //If there is a search Id, then edit mode.
    if (searchId) {
      this.loadFullSearch(searchId);
    } else {
      this.state.inProgress = false;
    }
  }



  handleChange = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  getDbIdForPerson = (name) => {
    let arrayOfLabels = this.state.personsForSuggestion.map(person => person.label);
    let index = arrayOfLabels.findIndex(label => label === name);
    return index === -1 ? -1 : "" + this.state.personsForSuggestion[index].id;
  }

  handleAddPerson = () => {
    if (this.state.name === '') {
      return;
    }

    const dbId = this.getDbIdForPerson(this.state.name);

    const oldPersons = this.state.dndData.persons;

    const newKeyName = "person" + (Object.keys(oldPersons).length + 1);
    const newPerson = {
      id: newKeyName,
      name: this.state.name,
      dbId: dbId === -1 ? 'new' : dbId,
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
    this.setState({
      dndData: newDndData,
      name: '',
    });
  }

  handleAddGroup() {
    const oldColumns = this.state.dndData.columns;

    const newColumnKey = "group" + (Object.keys(oldColumns).length + 1);
    const newColumn = {
      id: newColumnKey,
      name: 'new group',
      personIds: [],
      dbId: 'new',
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

  handleGroupNameChange = (groupKey, newName) => {
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

  handleDeleteGroup = (groupKey) => {
    //Get any person assigned to this group, put it to unassigned
    let newUnassignedPersonIds = this.state.dndData.columns[groupKey].personIds;
    const oldUnassignedPersonIds = this.state.dndData.columns.group1.personIds;
    newUnassignedPersonIds.push(...oldUnassignedPersonIds);

    //Remove the groups
    let newColumns = this.state.dndData.columns;
    delete newColumns[groupKey];

    let oldColumnOrder = this.state.dndData.columnOrder;
    let newColumnOrder = oldColumnOrder.filter(g => g !== groupKey);

    //assign the old group persons to "unassigned"
    const oldGroup1 = this.state.dndData.columns.group1;
    newColumns = {
      ...newColumns,
      group1: {
        ...oldGroup1,
        personIds: newUnassignedPersonIds,
      }
    };

    //now update the dndData and set state.     
    let newDndData = {
      ...this.state.dndData,
      columns: newColumns,
      columnOrder: newColumnOrder,
    };
    this.setState({ dndData: newDndData });
  }

  handleDeletePerson = (personKey) => {
    let newDndData = this.state.dndData;
    let columns = this.state.dndData.columns;

    //Remove assignments
    Object.keys(columns).forEach((group) => {
      const oldPersonIds = columns[group].personIds;
      let newPersonIds = oldPersonIds.filter(p => p !== personKey);
      if (newPersonIds.length !== oldPersonIds.length) {
        newDndData = {
          ...this.state.dndData,
          columns: {
            ...columns,
            [group]: {
              ...columns[group],
              personIds: newPersonIds,
            }
          }
        }
      }
    });

    //Remove person
    const oldPersons = this.state.dndData.persons;
    let newPersons = oldPersons;
    delete newPersons[personKey];

    //update dndData and set state
    newDndData = {
      ...newDndData,
      persons: newPersons
    };
    console.log(newDndData);
    this.setState({ dndData: newDndData }); 
  }

  handleSave = () => {
    this.setState({ saveInProgress: true });
    const dndData = this.state.dndData;

    let newPersons = [];
    let oldPersons = [];
    for (var key in dndData.persons) {
      let person = dndData.persons[key];
      if (person.dbId === 'new') {
        newPersons.push(person);
      }
      else {
        oldPersons.push(person);
      }
    }

    let newGroups = [];
    let oldGroups = [];
    for (var key in dndData.columns) {
      let group = dndData.columns[key];
      if (group.dbId === 'new') {
        newGroups.push(group);
      }
      else if (group.dbId !== '---') {
        oldGroups.push(group);
      }
    }

    let searchObjectToPost = {
      searchName: this.state.searchName,
      searchId: this.state.searchId,
      newPersons: newPersons,
      oldPersons: oldPersons,
      newGroups: newGroups,
      oldGroups: oldGroups,
    }

    console.log(JSON.stringify(searchObjectToPost));
    let currentComponent = this;
    postAllManagement(searchObjectToPost).then(function (response) {
      currentComponent.setState({ saveInProgress: false });
      let newWindowLocation = `${window.location.href}`;

      //Jump to the previous path (i.e. manage)
      let newUrlArray = newWindowLocation.split('/');
      newUrlArray.pop();
      newWindowLocation = newUrlArray.join('/');
      newWindowLocation = newWindowLocation.concat('/');

      window.location = newWindowLocation;
    });
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
    const { inProgress, saveInProgress } = this.state;

    let contentInPaper = {};
    let saveInProgressCircular = saveInProgress ? <CircularProgress className={classes.progress} size={20} /> : null;

    if (inProgress) {
      contentInPaper =
        <Paper style={{ margin: "2%", padding: "2%" }}>
          <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} size={50} />
          </div>
        </ Paper>
    }
    else {
      contentInPaper =
        <Paper style={{ margin: "2%", padding: "2%" }}>
          <div className={classes.root}>
            <TextField
              label="Search name"
              id="name"
              className={classNames(classes.margin, classes.textField)}
              value={this.state.searchName}
              onChange={this.handleChange('searchName')}
            />

          </div>
          <div>
            <AutoSuggestName
              name={this.state.name}
              handleNameEntry={this.handleNameEntry}
              personsForSuggestion={this.state.personsForSuggestion}
            />
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
            handleDeleteGroup={this.handleDeleteGroup}
            handleDeletePerson={this.handleDeletePerson}
          />
          <div className={classNames(classes.divFullWidth)}>
            <div className={(classes.buttonHolder)}>
              {saveInProgressCircular}
              <Button variant="contained" color="primary" className={classNames(classes.button, classes.saveButton)}
                onClick={() => this.handleSave()}>
                <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                Save
              </Button>
            </div>
          </div>
        </ Paper>
    }
    return (
      <div>
        <div>
          <TitleBar />
          <div className={classes.toolbar} />
          <h1 className={classes.pStyle}>Create a Search</h1>
        </div>
        {contentInPaper}
      </div>
    );
  }
}

export default withStyles(styles)(CreateSearch);


