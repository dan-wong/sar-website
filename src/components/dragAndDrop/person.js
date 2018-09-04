import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

const Container = styled.div`
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 3px;
    margin-bottom:3px;
    &:hover{
        background: Gainsboro;
    } 
    background-color: ${props => (props.isDragging ? 'Gainsboro' : 'white')};
`;

const styles = theme => ({
    idLabel: {
        fontSize: "10px",
    },
    nameLabel: {
        fontSize: "14px",
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
});

class Person extends React.Component {

    handleDeletePerson = () => {
        this.props.handleDeletePerson(this.props.person.id);
    }


    render() {
        const { classes } = this.props;

        let iconDiv = this.props.person.dbId === 'new' ?
            <div className={classes.buttonHolder}>
                <IconButton className={classes.deleteButton} aria-label="Delete" onClick={() => this.handleDeletePerson()}>
                    <DeleteIcon className={classes.deleteIcon} />
                </IconButton>
            </div>
            : null;

        return (
            <Draggable draggableId={this.props.person.id} index={this.props.index}>
                {(provided, snapshot) => (
                    <Container
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}
                        isDragging={snapshot.isDragging}
                    >
                        <div className={classes.firstRow}>
                            <p className={classes.idLabel}> id: {this.props.person.dbId} </p>
                            {iconDiv}
                        </div>
                        <p className={classes.nameLabel}> {this.props.person.name} </p>
                    </Container>
                )}
            </Draggable>
        );
    }
}

export default withStyles(styles)(Person);