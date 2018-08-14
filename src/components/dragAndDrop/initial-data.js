const initialData = {
    tasks: {
        'task-1': {id: 'task-1', content: "hi1"},
        'task-2': {id: 'task-2', content: "hi2"},
        'task-3': {id: 'task-3', content: "hi3"},
        'task-4': {id: 'task-4', content: "hi4"},        
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
    },

    //More later
    columnOrder:['column-1'],
}

export default initialData;