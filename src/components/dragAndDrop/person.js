import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { withStyles } from '@material-ui/core/styles';

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
    }
});

class Person extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Draggable draggableId={this.props.person.id} index={this.props.index}>
                {(provided, snapshot) => (
                    <Container
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}
                        isDragging={snapshot.isDragging}
                    >
                        <p className={classes.idLabel}> id: {this.props.person.dbId} </p>
                        <p className={classes.nameLabel}> {this.props.person.name} </p>
                    </Container>
                )}
            </Draggable>
        );
    }
}

export default withStyles(styles)(Person);