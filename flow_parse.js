
//Outputs Date and Time in a more readable format
function date_time(date){
    var arr = date.split("T");
    return "Date: "+arr[0] + " Time: "+arr[1];
}


//Outputs flow logs that match the filter requirement of an attribute given by the user
function filter_by(flog,attribute, filter){
    console.log(flog)
    console.log(flog.flow_logs[0][attribute].toString())
    for(var i=0;i<flog.number_of_flow_logs;i++){
        if(flog.flow_logs[i][attribute].toString()===filter){
            console.log(flog.flow_logs[i])
        }
    }
}

//returns time elasped in seconds from two inputted dates
function time_elapsed(start_date,end_date){
    var end_time = new Date(end_date)
    var start_time = new Date(start_date)
    var sec_elapsed = (end_time.getTime()-start_time.getTime())/1000
    return "Time elapsed in seconds: "+(end_time.getTime()-start_time.getTime())/1000

}
var flow_log;

//reads in json file
function input(){
    const fs = require('fs');
    const { time } = require('console');
    fs.readFile('./flow-log-1.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err)
            return
        }
        try {
            flow_log = JSON.parse(jsonString)
            console.log(flow_log)
            main()
            return

    } catch(err) {
            console.log('Error parsing JSON string:', err)
            return

        }
    })
}



function main(){
    const readline = require('readline-sync');

    do{  

        var option;
        option = readline.question(`choose option
        1. print flowlogs
        2. filter flow logs by attributes
        3. exit
        \n`);

        switch(option) {

            case "1":
                console.log("you've selected option 1:\n\n");
                console.log(flow_log)
                break;
            case "2":
                console.log("you've selected option 2:\n\n");
                var attribute = readline.question("Choose an attribute to filter by: ")
                var filter = readline.question("Choose the value of that attribute you want to filter by: ") 
                filter_by(flow_log,attribute,filter);
                break;
            case "3":
                console.log("exiting...\n\n\n\n\n");
                option=-1;
                break;

            default:
                console.log("invalid option\n\n\n\n\n");

        }

    }while(option!=-1);
}
input()