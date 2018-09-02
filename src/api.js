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