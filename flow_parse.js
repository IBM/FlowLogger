//Outputs Date and Time in a more readable format
const logFolder = './logs';
const fs = require('fs');
const { time } = require('console');
var flow_log;
const readline = require('readline-sync');


function date_time(date){
    var arr = date.split("T");
    return "Date: "+arr[0] + " Time: "+arr[1];
}


//Function made by Daroush that allows the user to select a certain log by number from the logs folder
function selectLog(){
    let count=0;
    var files={};
    fs.readdirSync(logFolder).forEach(file => {
        files[count]=file;
        console.log(count+". "+file);
        count++;
    });
    var selection = readline.question(`\nselect log\n`);
    if(selection=='q'){
        return
    }
    while(selection<0||selection>=count){
        selection = readline.question("Not a valid log, enter again")
        if(selection=='q'){
            return
        }
    }
    if(selection>=0 && selection<count){
        return "./logs/"+files[selection];
    }
}

//Outputs flow logs that match the filter requirement of an attribute given by the user

//TODO: filter by multiple attributes

function filter_by(flow_log,attributes, filter){
    var allowed = true
    var arr = flow_log.flow_logs
    var valid_arr = [];

    for(var i=0;i<arr.length;i++){
        for(var j=0;j<attributes.length;j++){
            if(!(arr[i][attributes[j]].toString()===filter[j].toString())){
                allowed = false
            }
        }
        if(allowed){
            valid_arr.push(arr[i])
        }
        allowed = true
    }
    for(var i=0;i<valid_arr.length;i++){
        console.log(valid_arr[i])
    }

}


//returns time elasped in seconds from two inputted dates
function time_elapsed(start_date,end_date){
    var end_time = new Date(end_date)
    var start_time = new Date(start_date)
    var sec_elapsed = (end_time.getTime()-start_time.getTime())/1000
    return "Time elapsed in seconds: "+(end_time.getTime()-start_time.getTime())/1000

}

//reads in json file
//TODO: add implementation which filters through each of the json files rather than individual ones


function input(){
    fs.readFile(selectLog(), 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return;
        }
        try {
            flow_log = JSON.parse(jsonString);
            main()
            return;
        }
        catch (err) {
            console.log('Error parsing JSON string:', err);
            return;
        }
    })
}

function for_mat(flog,tabs){
    var s = ""
    for(k in flog){
        if(typeof(flog[k])==='object'){
            s += k+'\n'+for_mat(flog[k],'\t')
        }
        else{
            s += tabs+k+": "+flog[k]+"\n"
        }
    }
    return s
}

function output(file_name){
    var format_flow = for_mat(flow_log,"")

    console.log(flow_log)
    fs.writeFile(file_name, format_flow, (err) => {
        if (err) {
            console.log("Error reading file from disk:", err)
            return
        }
        try {
            return
    } catch(err) {
        console.log('Error parsing JSON string:', err)
        return
        }
    })
}


function main(){
    do{  

        var option;

        option = readline.question(`choose option
        1. print flowlogs
        2. filter flow logs by attributes
        3. save to a file
        4. exit
        \n`);

        switch(option) {

            case "1":
                console.log("you've selected option 1:\n\n");
                console.log(flow_log)
                break;
            case "2":
                var breakout = false
                var keys = []
                console.log("Attributes to filter by: \n\n");
                var count = 0;
                for(var k in flow_log.flow_logs[0]){
                    count+=1;
                    console.log(count+". "+k)
                    keys.push(k)
                }
                var attributes = [];
                var filters = [];
                var amt = readline.question("How many attributes do you want to filter by? Press q to quit")
                if(amt=='q'){
                    break;
                }
                    for(var i=0;i<amt;i++){
                        var attribute = readline.question(i+1+". Choose an attribute to filter by (type out the name or choose a number): ")
                        if(attribute=='q'){
                            break;
                        }
                        if(attribute.length<=2){
                            while(attribute>=22||attribute<=0){
                                attribute = readline.question("Invalid number choice, choose a new number or q to quit")
                                if(attribute==='q'){
                                    break
                                }
                            }
                            attribute = keys[attribute-1]
                        }
                        while(!keys.includes(attribute)){
                            attribute = readline.question("Please retype the attribute you want to filter by or press q to quit")
                            if(attribute==='q'){
                                break
                            }
                        }
                        if(attribute==='q'){
                            break
                        }
                        var list_val = []
                        
                        attributes.push(attribute)
                        for(var j=0;j<flow_log.flow_logs.length;j++){
                            list_val.push(flow_log.flow_logs[j][attribute])
                        }
                        var unique = list_val.filter((v, s, a) => a.indexOf(v) === s);
                        for(var j=0;j<unique.length;j++){
                            console.log(String.fromCharCode(97 + j)+". "+unique[j])
                        }
                        var filter = readline.question(i+1+". Choose the value of that attribute you want to filter by: ")

                        if(filter>='a'&&filter<=String.fromCharCode(97 + j)){
                            filter = unique[filter.charCodeAt(0) - 97]
                        }
                        while(!unique.includes(filter)){
                            filter = readline.question("Please retype the filter or press q to quit")
                            if(filter==='q'){
                                breakout = true
                                break
                            }

                        }
                        if(filter==='q'){
                            breakout = true
                            break;
                        }

                        filters.push(filter)
                    }
                    if(breakout){
                        break;
                    }
                    filter_by(flow_log, attributes,filters);
                break;

            case "3":
                var file_name = readline.question("Type in the file you want to save to: ")
                if(file_name=='q'){
                    break
                }
                output(file_name)
                break;
                
            case "4":
                console.log("exiting...\n\n\n\n\n");
                option=-1;
                break;

            default:
                console.log("invalid option\n\n\n\n\n");
        }

    }while(option!=-1);
}
module.exports.input = input;
module.exports.filter_by = filter_by;
