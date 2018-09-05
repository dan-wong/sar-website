import axios from 'axios';

var config = {
    headers: {
        'x-amz-docs-region': 'ap-southeast-2',
        'x-api-key': 'aChwigeT119iHNkwstc1satG5j2QToMQ8NPRKAzk',
    }
};

var configForPost = {
    headers: {
        'x-amz-docs-region': 'ap-southeast-2',
        'x-api-key': 'aChwigeT119iHNkwstc1satG5j2QToMQ8NPRKAzk',
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
}

export default {
    getSearchTrack(personID, groupID) {
        return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=event&personAndGroupId=${personID}+${groupID}`, config)
            .then(response => {
                return response.data.events;
            }).catch(error => {
                // alert(error);
            });
    }, 
    getGroupsInSearch(searchID) {
        return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=group&searchId=${searchID}`, config)
            .then(response => {
                return response.data.groups;
            });
    },
    getPeopleInGroup(groupID) {
        return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=person&groupId=${groupID}`, config)
            .then(response => {
                var persons = response.data.persons;
                return persons.sort((a, b) => {
                    if (a.id < b.id) {
                        return -1;
                    } 
                    return 1;
                });
            });
    },
}

export function getAllSearches() {
    return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=search&all=true`, config)
        .then(response => {
            return response.data.searches;
        });
}

export function getAllSearchesWithCount() {
    return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=search&allWithCount=true`, config)
        .then(response => {
            return response.data.searches;
        });
}

export function getAllPersons() {
    return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=person&all=true`, config)
        .then(response => {
            return response.data.persons;
        });
}

export function getFullSearch(searchId) {
    return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=search&full=${searchId}`, config)
        .then(response => {
            console.log(response);
            return response.data.fullSearch;
        });
}

export function postAllManagement(managementToPost) {
    return axios.post(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=search`, JSON.stringify(managementToPost), configForPost)
        .then(response => {
            console.log(response);
            return response.status;
        });
} 
