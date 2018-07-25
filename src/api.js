import axios from 'axios';

var config = {
//   headers : {
//     'x-amz-docs-region': 'ap-southeast-2',
//     'x-api-key': '47mmRZ4JLK5Y7W0gQrhUs43WzU3YdNoq9wLvMNKG',
//   }  
  headers : {
    'x-amz-docs-region': 'ap-southeast-2',
    'x-api-key': 'aChwigeT119iHNkwstc1satG5j2QToMQ8NPRKAzk',
  }  
};

export default {
    // getSearchTrack(personID, groupID) {
    //     return axios.get(`https://4beodlhpjg.execute-api.us-east-1.amazonaws.com/dev/personandgroupid?personid=${personID}&groupid=${groupID}`, config)
    //         .then(response => {
    //             return response.data.body;
    //         });
    // }

    getSearchTrack(personID, groupID) {
        return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=event&personAndGroupId=${personID}+${groupID}`, config)
            .then(response => {
                return response.data.events;
            });
    }
}

export function getAllSearches() {
    return axios.get(`https://c44r10nquk.execute-api.ap-southeast-2.amazonaws.com/test/sarFunction?type=search&personId=1`, config)
        .then(response => {
            return response.data.searches;
        });
}

