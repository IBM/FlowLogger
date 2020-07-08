
var access_token="";
var refresh_token="";
var apikey=require('../config.js').config.apiKeyId;
var axios=require('axios');
var qs=require('qs');

//getting token to perform api requests
async function getTokens(){
    axios({
        method: 'post',
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded','Accept': 'application/json'},
        url: 'https://iam.cloud.ibm.com/identity/token',
        data: qs.stringify({ grant_type: 'urn:ibm:params:oauth:grant-type:apikey', apikey: apikey}) 
    }).then(res => {
   
            access_token=res.data.access_token;
            refresh_token=res.data.refresh_token;
            
            getCollectors();
      
        }).catch(error => {
    console.log(error);
  });
   
}
//collecting available flow log collectors for the us-east region
async function getCollectors(){

    axios({
        method: 'get',
        headers:{ 'Authorization': "Bearer "+access_token},
        url: 'https://us-east.iaas.cloud.ibm.com/v1/flow_log_collectors?version=2020-06-30&generation=2'
    }).then(res => {
        
        formatCollectors(res.data.flow_log_collectors);
             
    })  .catch(error => {
            console.log(error)
            return null;
        });
       
}
//styling the json data
async function formatCollectors(collectors){   
    console.log("name        bucket             target type");
    for(var item in collectors){
        console.log(collectors[item].name+"  "+collectors[item].storage_bucket.name+"  "+collectors[item].target.name+" "+collectors[item].target.resource_type);
    }
}

module.exports = getTokens;