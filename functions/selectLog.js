const logFolder = './logs';
const fs = require('fs');
const readline = require("readline-sync");

function selectLog(){
    var count=1;
    var files={};
    fs.readdirSync(logFolder).forEach(file => {
        files[count]=file;
        console.log(count+". "+file);
        count++;
      });
      var selection = readline.question(`\nselect log\n`);
      if(selection>=0 && selection<count){
        
        return require("../logs/"+files[selection]);
      }
    
}
module.exports = selectLog;