const readline = require('readline-sync');

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
            break;

        case "2":
            console.log("exiting...\n\n\n\n\n");
            option=-1;
            break;

        default:
            console.log("invalid option\n\n\n\n\n");

      }

}while(option!=-1);