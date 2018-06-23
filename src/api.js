import axios from 'axios';

var config = {
  headers : {
    'x-amz-docs-region': 'ap-southeast-2',
    'x-api-key': '47mmRZ4JLK5Y7W0gQrhUs43WzU3YdNoq9wLvMNKG',
  }  
};

export default {
    getSearchTrack(personID, groupID) {
        return axios.get(`https://4beodlhpjg.execute-api.us-east-1.amazonaws.com/dev/personandgroupid?personid=${personID}&groupid=${groupID}`, config)
            .then(response => {
                return response.data.body;
            });
    }
}