const attribute_list = {"version":"0.0.1","collector_crn":"crn:v1:bluemix:public:is:us-south:a/cdefe6d99f7ea459aacb25775fb88a33::flow-log-collector:r006-44f7c28e-bda8-4d78-8c4b-2aed1f386223","attached_endpoint_type":"vnic","network_interface_id":"0737-40a0d077-c5ee-4751-8efb-65100fc07c1f","instance_crn":"crn:v1:bluemix:public:is:us-south-3:a/cdefe6d99f7ea459aacb25775fb88a33::instance:0737_507f76db-bd3d-4730-98d5-17c6a211010f","vpc_crn":"crn:v1:bluemix:public:is:us-south:a/cdefe6d99f7ea459aacb25775fb88a33::vpc:r006-acf267b4-ddd6-47ef-bae3-2643069a98ca","capture_start_time":"2020-07-01T20:28:18Z","capture_end_time":"2020-07-01T20:33:18Z","state":"ok","number_of_flow_logs":3,"flow_logs":[{"start_time":"2020-07-01T20:30:39Z","end_time":"2020-07-01T20:33:09Z","connection_start_time":"2020-07-01T20:30:39Z","direction":"O","action":"accepted","initiator_ip":"10.240.128.4","target_ip":"10.240.128.1","initiator_port":68,"target_port":67,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":false,"bytes_from_initiator":1368,"packets_from_initiator":4,"bytes_from_target":1280,"packets_from_target":4,"cumulative_bytes_from_initiator":1368,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":1280,"cumulative_packets_from_target":4},{"start_time":"2020-07-01T20:28:37Z","end_time":"2020-07-01T20:28:59Z","connection_start_time":"2020-07-01T20:28:37Z","direction":"O","action":"accepted","initiator_ip":"10.240.128.4","target_ip":"161.26.0.10","initiator_port":36919,"target_port":53,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":true,"bytes_from_initiator":288,"packets_from_initiator":4,"bytes_from_target":441,"packets_from_target":3,"cumulative_bytes_from_initiator":288,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":441,"cumulative_packets_from_target":3},{"start_time":"2020-07-01T20:28:34Z","end_time":"2020-07-01T20:28:49Z","connection_start_time":"2020-07-01T20:28:34Z","direction":"O","action":"accepted","initiator_ip":"0.0.0.0","target_ip":"255.255.255.255","initiator_port":68,"target_port":67,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":true,"bytes_from_initiator":1368,"packets_from_initiator":4,"bytes_from_target":0,"packets_from_target":0,"cumulative_bytes_from_initiator":1368,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":0,"cumulative_packets_from_target":0}]}

const fs = require('fs');
const path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
const process = require("process");
const readline = require('readline-sync');
const { time } = require('console');
var file_dir = "./logs"; //directory of the folder where json files are
const logFolder = './logs';

//Pulls all of the different values in a json file from the selectetd folder and returns an array
function getFilters(){
    let files = fs.readdirSync(file_dir)

    filter_arr = []
    files.forEach(function(file){
        var fromPath = path.join(file_dir,file)
        stat_file = fs.statSync(fromPath)
        if(stat_file.isFile()){
            var log_file = fs.readFileSync(fromPath)
            if(file.includes("DS_Store")===false){
                var flow_log = JSON.parse(log_file)
                filter_arr.push(flow_log.flow_logs)
            }
        }
    });
    return filter_arr
}



//Asks the user what attributes they want to filter the json files by
function get_attributes(){
    filter_arr = getFilters()
    var keys = []
    var count = 0;
    var attributes = [];
    var filters = [];
    var attribute;
    console.log("Attributes to filter by: \n\n");
    for(var k in attribute_list.flow_logs[0]){
        count+=1;
        console.log(count+". "+k)
        keys.push(k)
    }

    var amt = readline.question("How many attributes do you want to filter by?")
    if(amt==='q'){
        return
    }
    for(var i=0;i<amt;i++){
        var attribute = readline.question(i+1+". Choose an attribute to filter by: ")
        if(attribute==='q'){
            return
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
        var filter_list = []
        attributes.push(attribute)

        for(var w=0;w<filter_arr.length;w++){
            filter_list.push(filter_arr[w].attribute)
            for(var j=0;j<filter_arr[w].length;j++){
                filter_list.push(filter_arr[w][j][attribute])
            }
        }
        var o;
        filter_list.unshift(o)
        var unique = filter_list.filter((v, s, a) => a.indexOf(v) === s);
        unique = unique.slice(1)
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
        filters.push(filter)
    }
    readfiles(attributes,filters)
}


//Reads through each file in the specified directory and converts it into a JSON file
//Calls filter_by and uses returned value to determine if file fits specification
function readfiles(attributes,filters){
    let files = fs.readdirSync(file_dir)
    files.forEach(function(file){
        var fromPath = path.join(file_dir,file)
        stat_file = fs.statSync(fromPath)
        if(stat_file.isFile()){
            var log_file = fs.readFileSync(fromPath)
            if(file.includes("DS_Store")===false){
                var flow_log = JSON.parse(log_file)
                
                if(filter_by(flow_log,attributes,filters)){
                    console.log("The file "+file+" fits the attributes")
                }
            }
        }
    });
}


//returns true if the flow_log passed in has a flow log that contains attributes that match what the user is looking for
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
    
    if(valid_arr.length>0){
        return true
    }
    return false
}

//Function that allows user to select a specific log from the folder
function selectLog(){
    var count=0;
    var files={};
    fs.readdirSync(logFolder).forEach(file => {
        files[count]=file;
        console.log(count+". "+file);
        count++;
    });
    var selection = readline.question(`\nselect log\n`);
    if(selection==='q'){
        return
    }
    if(selection>=0 && selection<count){
        return require("./logs/"+files[selection]);
    }
}


//returns true if the end time of a log is between the given start and end date and false otherwise
function time_elapsed(log,start_date,end_date){
    var compare = new Date(log['capture_end_time'])
    if(compare.getTime()>=start_date.getTime()&&compare.getTime()<=end_date.getTime()){
        return true;
    }
    return false;
}

//the user inputs a time interval and the function returns which flow logs in the log folder fit the specific time frame
function time_filter(){
    var option = readline.question(`choose option
    1. Select a start and end time
    2. Choose how many minutes you want to go back
    3. exit
    \n`);
    var time_zone=0;
    var start_time;
    var end_time;
    if(option==='1'){
        time_zone = readline.question("Input the time shift you want from GMT i.e. -5 for EST")
        start_time = readline.question("Choose the start date of the flow logs in YYYY-MM-DD format: ")
        start_time = start_time+"T" + readline.question("Choose the start time of the flow log in HH:MM:SS format: ")+"Z"
        end_time = readline.question("Choose the end date of the flow logs in YYYY-MM-DD format, type now if you want to use the current time: ")
        end_time = start_time+"T" + readline.question("Choose the end time of the flow log in HH:MM:SS format, type now if you want to use the current time: ")+"Z"
        start_time = new Date(start_time)
        start_time.setHours(start_time.getHours()-time_zone)
        if(end_time.includes("now")){
            end_time = new Date()
        }else{
        var end_time = new Date(end_time)
        end_itme.setHours(end_time.getHours()-time_zone)

        }
        console.log(start_time)
    }
    if(option==='2'){
        var minutes = readline.question("How many minutes do you wanna go back?")
        start_time = new Date()
        console.log(minutes)
        start_time.setMinutes(start_time.getMinutes()-minutes)
        console.log(start_time)
        end_time = new Date()
    }

    if(option==='3'||option==='q'){
        return;
    }
    let files = fs.readdirSync(file_dir)
    files.forEach(function(file){
        var fromPath = path.join(file_dir,file)
        stat_file = fs.statSync(fromPath)
        if(stat_file.isFile()){
            var log_file = fs.readFileSync(fromPath)
            if(file.includes("DS_Store")===false){
                var flow_log = JSON.parse(log_file)
                
                if(time_elapsed(flow_log,start_time,end_time)){
                    console.log("The file "+file+" is in the time range")
                }
            }
        }
    });
   
}
function main(){
    var option;
    do{
        option = readline.question(`choose option
        1. select logs
        2. filter files by attributes
        3. filter by time
        4. exit
        \n`);
        switch(option){
            case "1":
                console.log(selectLog())
                break
            case "2":
                get_attributes()
                break
            case "3":
                time_filter()
                break
            case "4":
                option = -1
                break;
        }
    }while(option!=-1)
}

//module.exports.main = main;
module.exports = {main,filter_by,time_elapsed};
//main()