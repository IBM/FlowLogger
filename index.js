const readline = require("readline-sync");
const fs = require('fs');
const myCOS = require("ibm-cos-sdk");
const config = {
  endpoint: "",
  apiKeyId: "",
};
const getCollectors = require("./backend/getFlowLogs");
const getCOS = require("./backend/getFileFromCos");



const main = async function () {
  do {
    var option;
    option = readline.question(`choose option
        1. get flowlogs
        q. exit
        \n`);


        
     

    switch (option) {
      case "1":
        
      const apiPath = 'apikey.txt';
        try {
          if (fs.existsSync(apiPath)) {
            //file exists
            var key = fs.readFileSync(apiPath, 'utf8');
            console.log(key.length);
            config.apiKeyId = key;
          }
          else{
            //file doesn't exist
            config.apiKeyId = readline.question(`Please enter your API Key: \n`);
            fs.writeFileSync(apiPath, config.apiKeyId) //will write file if it doesn't exist
          }
        } catch(err) {
          console.error(err)
        } 
       
      
        
       
       
        // Get bucketName and region endpoint
        
        const collectors = await getCollectors(config.apiKeyId);
        const bucketName = collectors[0];
        config.endpoint = collectors[1];
        var cosClient = new myCOS.S3(config);
        // Retrieve all items from the COS bucket
        await getCOS.getBucketContents(bucketName, cosClient); 
        break;

    case "q":
        console.log("exiting...\n\n\n\n\n");
        option = -1;
        break;

    default:
        console.log("invalid option\n\n\n\n\n");
    }
  } while (option != -1);
};
module.exports.main = main;
module.exports.collectors = "";
