require('dotenv').config();

const readline = require("readline-sync");
const fs = require('fs');
const myCOS = require("ibm-cos-sdk");
const config = {
  endpoint: "",
  apiKeyId: "",
};
const getFlowlogs = require("./backend/getFlowLogs").main;
//const getCollectors = require("./backend/getFlowLogs").getCollectors;
const getCOS = require("./backend/getFileFromCos");
const { getRegion } = require("./backend/getFlowLogs");
const { getCollectors } = require("./backend/getFlowLogs");
const { formatCollectors } = require("./backend/getFlowLogs");
const { loadENV } = require("./backend/getFlowLogs");
const { env } = require('process');




const main = async function () {
  do {
    var option;
    option = readline.question(`choose option
        1. get flowlogs
        q. exit
        \n`);

    switch (option) {
      case "1":
    
      var worked = loadENV();
      /*
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
            fs.writeFileSync(apiPath, config.apiKeyId); //will write file if it doesn't exist
          }
        } catch(err) {
          console.error(err);
        } 
        
        */
    
    
      
        // Get bucketName and region endpoint
        //const collectors = await getCollectors(config.apiKeyId);
        //const bucketName = collectors[0];
        //config.endpoint = collectors[1];
        //fs.appendFileSync(envPath, BUCKETNAME+bucketName+'\n');

        // Retrieve all items from the COS bucket
        config.apiKeyId = process.env.API_KEY;
        config.endpoint = process.env.ENDPOINT;
        var cosClient = new myCOS.S3(config);
        await getCOS.getBucketContents(process.env.BUCKET_NAME, cosClient); 
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

