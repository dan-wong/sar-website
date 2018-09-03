import axios from 'axios';

var config = {
  headers : {
    'x-amz-docs-region': 'ap-southeast-2',
    'x-api-key': 'aChwigeT119iHNkwstc1satG5j2QToMQ8NPRKAzk',
  }  
};

export default {
    getSearchTrack(personID, groupID) {
        return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=event&personAndGroupId=${personID}+${groupID}`, config)
            .then(response => {
                return response.data.events;
            });
    }, 
    getGroupsInSearch(searchID) {
        return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=group&searchId=${searchID}`, config)
            .then(response => {
                return response.data.groups;
            });
    }
}

export function getAllSearches() {
    return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=search&all=true`, config)
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

export function postAllManagement() {
    return axios.post(`localhost`, {}, config)
        .then(response => {
            return response.status;
        });
}

