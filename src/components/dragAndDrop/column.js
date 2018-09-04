import React from 'react'
import styled from 'styled-components';
import classNames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';
import TextField from '@material-ui/core/TextField';
import Person from './person';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const Container = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    width: 220px;

    display: flex;
    flex-direction: column;
`;
const Title = styled.h3`
    padding: 8px;
`;
const TaskList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'Silver' : 'white')};
    flex-grow: 1;
    min-height: 100px;
`;

const styles = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
    textField: {
        flexBasis: 70,
    },
    idLabel: {
        fontSize: "10px",
    },
    deleteButton: {
        width: '15px',
        height: '15px',
        margin: 0,
        padding: 0,
    },
    buttonHolder: {
        justifyContent: 'flex-end',
        display: 'flex',
        width: '75%',
    },
    deleteIcon: {
        fontSize: "20px",
    },
    firstRow: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    topRight: {
        display: 'flex'
    }
});

class Column extends React.Component {
    handleGroupNameChange = () => event => {
        this.props.handleGroupNameChange(this.props.column.id, event.target.value);
    }

    handleDeleteGroup = () => {
        this.props.handleDeleteGroup(this.props.column.id);
    }

    render() {
        const { classes } = this.props;

        let iconDiv = this.props.column.dbId === 'new' ?
        <div className={classes.buttonHolder}>
            <IconButton className={classes.deleteButton} aria-label="Delete" onClick={() => this.handleDeleteGroup()}>
                <DeleteIcon className={classes.deleteIcon} />
            </IconButton>
        </div>
        : null;

        return (
            <Container>
                <div className={classes.firstRow}>
                    <p className={classNames(classes.idLabel, classes.margin)}> id: {this.props.column.dbId} </p>
                    {iconDiv}
                </div>
                <TextField
                    label="Group name"
                    id="name"
                    value={this.props.column.name}
                    className={classNames(classes.margin, classes.textField)}
                    onChange={this.handleGroupNameChange()}
                    InputProps={{
                        disabled: this.props.column.id == 'group1',
                    }}
                />
                <Droppable droppableId={this.props.column.id}>
                    {(provided, snapshot) => (
                        <TaskList
                            innerRef={provided.innerRef}
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            {this.props.persons.map((person, index) => (
                                <Person 
                                    key={person.id} 
                                    person={person} 
                                    index={index} 
                                    handleDeletePerson={this.props.handleDeletePerson}
                                />
                            ))}
                            {provided.placeholder}
                        </TaskList>
                    )}

                </Droppable>
            </Container>
        );
    }
}

export default withStyles(styles)(Column);