import series from 'async/series';

import axios from 'axios';
let url="https://v2mzkzwqi8.execute-api.ca-central-1.amazonaws.com/prod/"
const userdataObject = {
    post: async (data,endPoint,callback)=>{
        axios({
            method: 'POST',
            url: url+endPoint,
            data: data
          }).then(response => {
                console.log("response ",response)
                return callback(response);
          }) 
          .catch(err => {
                console.log(err);
          });
    },

 
    get: async (data,endPoint,callback)=>{
      axios({
          method: 'GET',
          url: url+endPoint,
          data: {
          
          }
        }).then(response => {
          
              return callback(response);
        }) 
        .catch(err => {
              console.log(err);
        });
  },

  
  delete: async (data,endPoint,callback)=>{
      axios({
          method: 'DELETE',
          url: url+endPoint,
          data: data
        }).then(response => {
              return callback(response);
        }) 
        .catch(err => {
              console.log(err);
        });
  },

  put: async (data,endPoint,callback)=>{
      axios({
          method: 'PUT',
          url: url+endPoint,
          data: data
        }).then(response => {
          
              return callback(response);
        }) 
        .catch(err => {
              console.log(err);
        });
  },

}
export default userdataObject;