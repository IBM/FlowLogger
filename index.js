const readline = require('readline-sync');
const myCOS = require('ibm-cos-sdk');
const fs = require('fs');
var config = require('./config.js').config
var cosClient = new myCOS.S3(config);

async function getBucketContents(bucketName) {
    console.log(`Retrieving bucket contents from: ${bucketName}`);
    return cosClient.listObjects(
        {Bucket: bucketName},
    ).promise()
    .then((data) => {
        if (data != null && data.Contents != null) {
            for (var i = 0; i < data.Contents.length; i++) {
                var itemKey = data.Contents[i].Key;
                var itemSize = data.Contents[i].Size;
                console.log(`Item: ${itemKey} (${itemSize} bytes).`)
            }
        }    
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}
async function getItem(bucketName, itemName) {
    console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
    return cosClient.getObject({
        Bucket: bucketName, 
        Key: itemName
    }).promise()
    .then((data) => {
        if (data != null) {
            try { 
                fs.writeFileSync(itemName, Buffer.from(data.Body).toString())
                console.log("File written successfully"); 
              } catch(err) { 
                console.error(err); 
              }  
        }    
    })
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}
var main = async function(){
    do{  
        var option;
        option = readline.question(`choose option
        1. get flowlogs
        2. exit
        \n`);
    
        switch(option) {

            case "1":
                console.log("you've selected option 1\n\n\n\n\n");
                //call flowlogs backend function
                await getBucketContents("flowlog-sub-ryan")
                await getItem("flowlog-sub-ryan","00000003.json")
                break;

            case "2":
                console.log("exiting...\n\n\n\n\n");
                option=-1;
                break;

            default:
                console.log("invalid option\n\n\n\n\n");

        }

    }while(option!=-1);
}
main();