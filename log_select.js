const attribute_list = {"version":"0.0.1","collector_crn":"crn:v1:bluemix:public:is:us-south:a/cdefe6d99f7ea459aacb25775fb88a33::flow-log-collector:r006-44f7c28e-bda8-4d78-8c4b-2aed1f386223","attached_endpoint_type":"vnic","network_interface_id":"0737-40a0d077-c5ee-4751-8efb-65100fc07c1f","instance_crn":"crn:v1:bluemix:public:is:us-south-3:a/cdefe6d99f7ea459aacb25775fb88a33::instance:0737_507f76db-bd3d-4730-98d5-17c6a211010f","vpc_crn":"crn:v1:bluemix:public:is:us-south:a/cdefe6d99f7ea459aacb25775fb88a33::vpc:r006-acf267b4-ddd6-47ef-bae3-2643069a98ca","capture_start_time":"2020-07-01T20:28:18Z","capture_end_time":"2020-07-01T20:33:18Z","state":"ok","number_of_flow_logs":3,"flow_logs":[{"start_time":"2020-07-01T20:30:39Z","end_time":"2020-07-01T20:33:09Z","connection_start_time":"2020-07-01T20:30:39Z","direction":"O","action":"accepted","initiator_ip":"10.240.128.4","target_ip":"10.240.128.1","initiator_port":68,"target_port":67,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":false,"bytes_from_initiator":1368,"packets_from_initiator":4,"bytes_from_target":1280,"packets_from_target":4,"cumulative_bytes_from_initiator":1368,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":1280,"cumulative_packets_from_target":4},{"start_time":"2020-07-01T20:28:37Z","end_time":"2020-07-01T20:28:59Z","connection_start_time":"2020-07-01T20:28:37Z","direction":"O","action":"accepted","initiator_ip":"10.240.128.4","target_ip":"161.26.0.10","initiator_port":36919,"target_port":53,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":true,"bytes_from_initiator":288,"packets_from_initiator":4,"bytes_from_target":441,"packets_from_target":3,"cumulative_bytes_from_initiator":288,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":441,"cumulative_packets_from_target":3},{"start_time":"2020-07-01T20:28:34Z","end_time":"2020-07-01T20:28:49Z","connection_start_time":"2020-07-01T20:28:34Z","direction":"O","action":"accepted","initiator_ip":"0.0.0.0","target_ip":"255.255.255.255","initiator_port":68,"target_port":67,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":true,"bytes_from_initiator":1368,"packets_from_initiator":4,"bytes_from_target":0,"packets_from_target":0,"cumulative_bytes_from_initiator":1368,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":0,"cumulative_packets_from_target":0}]}

const fs = require('fs');
const path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
const process = require("process");
const readline = require('readline-sync');
const { time } = require('console');
var file_dir = "./logs"; //directory of the folder where json files are


//Asks the user what attributes they want to filter the json files by
function get_attributes(){
    var keys = []
    var count = 0;
    var attributes = [];
    var filters = [];
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
            attribute = keys[attribute-1]
        }
        attributes.push(attribute)
        var filter = readline.question(i+1+". Choose the value of that attribute you want to filter by: ")
        if(filter==='q'){
            return
        }
        filters.push(filter)
    }
    readfiles(attributes,filters)
}

//iterates through every file in the folder
function readfiles(attributes,filters){
    fs.readdir(file_dir, function (err, files) {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }
        files.forEach(function (file, index) {
            var fromPath = path.join(file_dir, file);
            fs.stat(fromPath, function (error, stat) {
                if (error) {
                    console.error("Error stating file.", error);
                    return;
                }

                if (stat.isFile()){
                    input(file,attributes,filters)
                }
            });
        });
    });
}

//reads the files (path provided readfiles) and then converts them into JSON object
function input(stat,attributes,filter){
    var og = stat
    stat = file_dir+"/"+stat

    fs.readFile(stat, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err)
            return
        }
        try {
            if(og.includes("DS_Store")===false){
                flow_log = JSON.parse(jsonString)

                if(filter_by(flow_log,attributes,filter)){
                    console.log("The file "+stat+" fits the criteria")
                }
        }

    } catch(err) {
        console.log('Error parsing JSON string:', err)
        return
        }
    })
}

//returns true if the flow_log passed in has a flow log that contains attributes that match what the user is looking for
function filter_by(flow_log,attributes, filter){
    var allowed = true
    const arr = flow_log.flow_logs
    const valid_arr = [];

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

const logFolder = './logs';

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

function main(){
    var option;
    option = readline.question(`choose option
    1. select logs
    2. filter files by attributes
    3. exit
    \n`);
    switch(option){
        case "1":
            console.log(selectLog())
            break
        case "2":
            get_attributes()
            break
    }
}

module.exports.main = main;