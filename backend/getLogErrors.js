const colors = require('colors');
function getLogErrors(){
    const file=require("../logs/file.json");
    var rejectCount=0;
    for (var i=0;i<file.flow_logs.length;i++) {
        if(file.flow_logs[i].action=='rejected'){
            rejectCount++;
        }
    }
    console.log(file);
    if(rejectCount==1){
        console.log(("\n\nERROR: "+rejectCount+" action was rejected in the flowlogs\n\n\n").red);
    }else if(rejectCount>1){
        console.log(("\nERROR: "+rejectCount+" actions were rejected in the flowlogs\n\n\n").red);
    }else{
        console.log(("No Errors were detected in the flowlogs\n\n\n\n").green);
    }
}
module.exports = getLogErrors;