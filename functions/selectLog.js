const logFolder = './logs';
const fs = require('fs');
const readline = require("readline-sync");

function selectLog(){
    var count=1;
    var files={};
    var selection=0;
    console.log("\n");
    fs.readdirSync(logFolder).forEach(file => {
      files[count]=file;
      console.log(count+". "+file);
      count++;
    });
      do{
      
        selection = readline.question(`\nselect log\n`);
        if(isNaN(selection)|| selection== "" || parseInt(selection)<=0 || parseInt(selection)>=count){
          console.log("invalid option");
        }  
      }while(isNaN(selection)|| selection== "" || parseInt(selection)<=0 || parseInt(selection)>=count);
      return require("../logs/"+files[selection]);
}
module.exports = selectLog;