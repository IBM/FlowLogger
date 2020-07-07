# acl-logs
When traffic is denied to a VPC by ACLs or security groups, the only way to investigate is to look at flow logs. Currently, flow logs are hard to read and manage. We are going to build a tool that runs SQL queries on the logs to generate important information in a readable format. 

## Instructions
* Must have node js installed.

* Install node js with `brew install node`.

* Run `npm install readline-sync` in the project directory. This package allows an easy way to obtain user input.

* Use `node index.js` in the project directory to run the program.
