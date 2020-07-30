const { exportAllDeclaration } = require('@babel/types');
const attribute_list = {"version":"0.0.1","collector_crn":"crn:v1:bluemix:public:is:us-south:a/cdefe6d99f7ea459aacb25775fb88a33::flow-log-collector:r006-44f7c28e-bda8-4d78-8c4b-2aed1f386223","attached_endpoint_type":"vnic","network_interface_id":"0737-40a0d077-c5ee-4751-8efb-65100fc07c1f","instance_crn":"crn:v1:bluemix:public:is:us-south-3:a/cdefe6d99f7ea459aacb25775fb88a33::instance:0737_507f76db-bd3d-4730-98d5-17c6a211010f","vpc_crn":"crn:v1:bluemix:public:is:us-south:a/cdefe6d99f7ea459aacb25775fb88a33::vpc:r006-acf267b4-ddd6-47ef-bae3-2643069a98ca","capture_start_time":"2020-07-01T20:28:18Z","capture_end_time":"2020-07-01T20:33:18Z","state":"ok","number_of_flow_logs":3,"flow_logs":[{"start_time":"2020-07-01T20:30:39Z","end_time":"2020-07-01T20:33:09Z","connection_start_time":"2020-07-01T20:30:39Z","direction":"O","action":"accepted","initiator_ip":"10.240.128.4","target_ip":"10.240.128.1","initiator_port":68,"target_port":67,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":false,"bytes_from_initiator":1368,"packets_from_initiator":4,"bytes_from_target":1280,"packets_from_target":4,"cumulative_bytes_from_initiator":1368,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":1280,"cumulative_packets_from_target":4},{"start_time":"2020-07-01T20:28:37Z","end_time":"2020-07-01T20:28:59Z","connection_start_time":"2020-07-01T20:28:37Z","direction":"O","action":"accepted","initiator_ip":"10.240.128.4","target_ip":"161.26.0.10","initiator_port":36919,"target_port":53,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":true,"bytes_from_initiator":288,"packets_from_initiator":4,"bytes_from_target":441,"packets_from_target":3,"cumulative_bytes_from_initiator":288,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":441,"cumulative_packets_from_target":3},{"start_time":"2020-07-01T20:28:34Z","end_time":"2020-07-01T20:28:49Z","connection_start_time":"2020-07-01T20:28:34Z","direction":"O","action":"accepted","initiator_ip":"0.0.0.0","target_ip":"255.255.255.255","initiator_port":68,"target_port":67,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":true,"bytes_from_initiator":1368,"packets_from_initiator":4,"bytes_from_target":0,"packets_from_target":0,"cumulative_bytes_from_initiator":1368,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":0,"cumulative_packets_from_target":0}]}

const log_select = require('../log_select.js')

const fs = require('fs');
const path = require('path');
// In newer Node.js versions where process is already global this isn't necessary.
const process = require("process");
const readline = require('readline-sync');
const { time } = require('console');
var file_dir = "./logs"; //directory of the folder where json files are
const logFolder = './logs';

test("check filter_by", async () => {
    var test_flowlog = {"version":"0.0.1","collector_crn":"crn:v1:bluemix:public:is:us-south:a/cdefe6d99f7ea459aacb25775fb88a33::flow-log-collector:r006-44f7c28e-bda8-4d78-8c4b-2aed1f386223","attached_endpoint_type":"vnic","network_interface_id":"0737-40a0d077-c5ee-4751-8efb-65100fc07c1f","instance_crn":"crn:v1:bluemix:public:is:us-south-3:a/cdefe6d99f7ea459aacb25775fb88a33::instance:0737_507f76db-bd3d-4730-98d5-17c6a211010f","vpc_crn":"crn:v1:bluemix:public:is:us-south:a/cdefe6d99f7ea459aacb25775fb88a33::vpc:r006-acf267b4-ddd6-47ef-bae3-2643069a98ca","capture_start_time":"2020-07-01T20:28:18Z","capture_end_time":"2020-07-01T20:33:18Z","state":"ok","number_of_flow_logs":3,"flow_logs":[{"start_time":"2020-07-01T20:30:39Z","end_time":"2020-07-01T20:33:09Z","connection_start_time":"2020-07-01T20:30:39Z","direction":"O","action":"accepted","initiator_ip":"10.240.128.4","target_ip":"10.240.128.1","initiator_port":68,"target_port":67,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":false,"bytes_from_initiator":1368,"packets_from_initiator":4,"bytes_from_target":1280,"packets_from_target":4,"cumulative_bytes_from_initiator":1368,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":1280,"cumulative_packets_from_target":4},{"start_time":"2020-07-01T20:28:37Z","end_time":"2020-07-01T20:28:59Z","connection_start_time":"2020-07-01T20:28:37Z","direction":"O","action":"accepted","initiator_ip":"10.240.128.4","target_ip":"161.26.0.10","initiator_port":36919,"target_port":53,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":true,"bytes_from_initiator":288,"packets_from_initiator":4,"bytes_from_target":441,"packets_from_target":3,"cumulative_bytes_from_initiator":288,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":441,"cumulative_packets_from_target":3},{"start_time":"2020-07-01T20:28:34Z","end_time":"2020-07-01T20:28:49Z","connection_start_time":"2020-07-01T20:28:34Z","direction":"O","action":"accepted","initiator_ip":"0.0.0.0","target_ip":"255.255.255.255","initiator_port":68,"target_port":67,"transport_protocol":17,"ether_type":"IPv4","was_initiated":true,"was_terminated":true,"bytes_from_initiator":1368,"packets_from_initiator":4,"bytes_from_target":0,"packets_from_target":0,"cumulative_bytes_from_initiator":1368,"cumulative_packets_from_initiator":4,"cumulative_bytes_from_target":0,"cumulative_packets_from_target":0}]};
    //var test_log = JSON.parse(attribute_list)
    //dummy api response data
    
    //expect(await getTokens("G1234")).toBe("eyJhbGciOiJIUz......sgrKIi8hdFs");

    expect(log_select.filter_by(test_flowlog,['action'],['accepted'])).toBe(true)
    expect(log_select.filter_by(test_flowlog,['bytes_from_initiator'],[1000])).toBe(false)
});


test("check time_elapsed", async () =>{
    var start_time = new Date("2020-07-01T20:28:18Z")
    expect(log_select.time_elapsed(test_flowlog,start_time,new Date())).toBe(true)
});

