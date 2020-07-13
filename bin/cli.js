#!/usr/bin/env node

const { input } = require('../flow_parse.js');

let getFlowLog = require('../index.js').main
let filter = require('../flow_parse.js').input
switch(process.argv[2]){
    case "get":
        getFlowLog()
        break
    case "parse":
        filter()
        break
    default:
        console.log("Invalid command.")
}