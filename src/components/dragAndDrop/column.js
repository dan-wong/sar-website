import React from 'react'
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Person from './task';

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
    background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
    flex-grow: 1;
    min-height: 100px;
`;

export default class Column extends React.Component {
    render() {
        return (
            <Container>
                <Title> {this.props.column.name}</Title>
                <Droppable droppableId={this.props.column.id}>
                    {(provided, snapshot) => (
                        <TaskList
                            innerRef={provided.innerRef}
                            {...provided.droppableProps}
                            isDraggingOver={snapshot.isDraggingOver}
                        >
                            {this.props.persons.map((person, index) => (
                                <Person key={person.id} person={person} index={index} />
                            ))}    
                            {provided.placeholder}
                        </TaskList>                           
                    )}

                </Droppable>
            </Container>
        );
    }
}