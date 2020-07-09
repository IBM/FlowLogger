const readline = require('readline-sync');
var access_token="";
var refresh_token="";
var apikey=require('../config.js').config.apiKeyId;
var axios=require('axios');
var qs=require('qs');
var regionEndpoint="";
var bucketName="";

//getting token to perform api requests
async function getTokens(){
    await axios({
        method: 'post',
        headers:{ 'Content-Type': 'application/x-www-form-urlencoded','Accept': 'application/json'},
        url: 'https://iam.cloud.ibm.com/identity/token',
        data: qs.stringify({ grant_type: 'urn:ibm:params:oauth:grant-type:apikey', apikey: apikey}) 
    }).then(async res => {
   
            access_token=res.data.access_token;
            refresh_token=res.data.refresh_token;
            
             //await getCollectors();
      
        }).catch(error => {
    console.log(error);
  });
   
}
//collecting available flow log collectors for the us-east region
async function getCollectors(){

    await getTokens();
var region=await getRegion();
    await axios({
        method: 'get',
        headers:{ 'Authorization': "Bearer "+access_token},
        url: 'https://'+region+'.iaas.cloud.ibm.com/v1/flow_log_collectors?version=2020-06-30&generation=2'
    }).then(async res => {
        
         await formatCollectors(res.data.flow_log_collectors);
             
    })  .catch(error => {
            console.log(error)
            return null;
        });
        bucketName=readline.question(`
        Type in bucket name
            \n`);
        //console.log([bucketName,regionEndpoint]);
        return [bucketName,regionEndpoint];
}
//getting region
async function getRegion(){
    
    do{
    var loop=false;
    var region=readline.question(`
    Select Region
        1. US South
        2. US East
        3. United Kingdom
        4. EU Germany
        \n`);
    
      
        switch(region){
            case "1":
                region ="us-south";
                break;
            case "2":
                region ="us-east";
                break;
            case "3":
                region ="eu-gb";
                break;
            case "4":
                region ="eu-de";
                break;
            default:
                console.log("Invalid region");
                loop=true;
        }
        regionEndpoint='s3.'+region+'.cloud-object-storage.appdomain.cloud';
    }while(loop==true);
    
    return region;
}
//styling the json data
async function formatCollectors(collectors){   
   
    console.log("name        bucket");
    for(var item in collectors){
        console.log(collectors[item].name+"  "+collectors[item].storage_bucket.name/*+"  "+collectors[item].target.name+" "+collectors[item].target.resource_type*/);
    }
    
}
 

module.exports = getCollectors;