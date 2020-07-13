# acl-logs

When traffic is denied to a VPC by ACLs or security groups, the only way to investigate is to look at flow logs. Currently, flow logs are hard to read and manage. We are going to build a tool that runs SQL queries on the logs to generate important information in a readable format.


## Instructions

- Must have node js installed.

- Install node js with `brew install node`.

- Run `npm install readline-sync` in the project directory. This package allows an easy way to obtain user input.
- Run `npm install axios` in the project directory
- Run `npm install ibm-cos-sdk` in the project directory
- Run `npm install qs` in the project directory

- Use `node index.js` in the project directory to run the program.

## How to get your API Key
- Log in to to cloud.ibm.com
- Click "Manage" in the top right menu bar
- Select "Access (IAM)"
- Select "API keys" on the left menu
- You can create a API key in this page, and make sure to store it securely
