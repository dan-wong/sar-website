import React from 'react';

import styled from 'styled-components';
import Column from './column';
import { DragDropContext } from 'react-beautiful-dnd';

const Container = styled.div`
    display: flex;
    flex-flow: row wrap;
`;


export default class DnDApp extends React.Component {
    constructor(props) {
        super(props);
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps);
    //     //this.setState({state: createInitialData(nextProps.numberOfGroups)})
    //     const newState = createInitialData(nextProps.numberOfGroups);
    //     this.setState(newState);
    //     console.log(this.state);
    // }

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
        this.props.onDragEnd(result);
    }

    render() {
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
            // onDragStart={this.onDragStart}
            // onDragUpdate={this.onDragUpdate}
            >

                <Container>
                    {this.props.dndData.columnOrder.map(columnId => {
                        const column = this.props.dndData.columns[columnId];
                        const persons = column.personIds.map(personId => this.props.dndData.persons[personId]);

                        return <Column
                            key={column.id}
                            column={column}
                            persons={persons}
                            handleGroupNameChange={this.props.handleGroupNameChange}
                        />;
                    })}
                </Container>
            </DragDropContext>
        )
    }
}