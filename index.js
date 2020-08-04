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
const { getTokens } = require("./backend/getFlowLogs");
const { formatCollectors } = require("./backend/getFlowLogs");
const { loadAPI } = require("./backend/getFlowLogs");
const { env } = require('process');
const { ConfigurationOptions } = require('ibm-cos-sdk/lib/config');




const main = async function () {
  var option;
  while (true) {
    if (option != "wait")
      option = readline.question(`choose option
        1. get flowlogs
        q. exit
        \n`);

    switch (option) {
      case "1":
      const envPath = '.env';
      if (fs.existsSync(envPath)) {
        if(process.env.API_KEY == ""){//if env file is empty
          var setAPI = await loadAPI();
        }
      }
      else{
        var setAPI = await loadAPI();
      }

      var regionArr = getRegion();
      var region = regionArr[0];
      config.endpoint = regionArr[1];
      //get token to call getColleectors 
      var access_token = await getTokens(process.env.API_KEY);
      //set bucket name to env 
      var flowLogCollectors = await getCollectors(access_token, region);
      var bucket_name = formatCollectors(flowLogCollectors);
    
        // Retrieve all items from the COS bucket using .env 
        config.apiKeyId = process.env.API_KEY;
        var cosClient = new myCOS.S3(config);
        await getCOS.getBucketContents(bucket_name, cosClient); 
        break;

      case "q":
        console.log("returning...\n\n\n\n\n");
        return;

    default:
        console.log("invalid option\n\n\n\n\n");
    }
  } while (option != -1);
};
module.exports.main = main;

