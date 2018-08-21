import React from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components';
import Column from './column';
import { DragDropContext } from 'react-beautiful-dnd';

const Container = styled.div`
    display: flex;
    flex-flow: row wrap;
`;

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


export default class DnDApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = createInitialData(3);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        //this.setState({state: createInitialData(nextProps.numberOfGroups)})
        const newState = createInitialData(nextProps.numberOfGroups);
        this.setState(newState);
        console.log(this.state);
    }

    // onDragStart = () => {
    //     document.body.style.color = 'orange';
    //     document.body.style.transition = 'background color 0.2 ease'
    // };

    // onDragUpdate = update => {
    //     const {destination} = update;
    //     const opacity = destination 
    //         ? destination.index / Object.keys(this.state.tasks).length
    //         : 0;
    //     document.body.style.backgroundColor = `rgba(153, 141, 217, ${opacity})`;
    // }

    onDragEnd = result => {
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

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];

        if (start === finish) {
            const newPersonIds = Array.from(start.personIds);
            newPersonIds.splice(source.index, 1);
            newPersonIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                personIds: newPersonIds,
            };

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                },
            };
            this.setState(newState);
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

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        }
        this.setState(newState);
    }

    render() {
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
            // onDragStart={this.onDragStart}
            // onDragUpdate={this.onDragUpdate}
            >
                <Container>
                    {this.state.columnOrder.map(columnId => {
                        const column = this.state.columns[columnId];
                        const persons = column.personIds.map(personId => this.state.persons[personId]);

                        return <Column key={column.id} column={column} persons={persons} />;
                    })}
                </Container>
            </DragDropContext>
        )


    }
}