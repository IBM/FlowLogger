# Flowlogger

## Contents

1. [Overview](#overview)
2. [Flow Logs](#flow-logs)
3. [Getting started](#getting-started)
4. [Resources](#resources)

## Overview 

When traffic is denied to a VPC by ACLs or security groups, the only way to investigate is to look at flow logs. Currently, flow logs are hard to read and manage. We are going to build a tool that runs SQL queries on the logs to generate important information in a readable format.

_Please note that this plug-in is in the **EXPERIMENTAL** phase and there is no official support at the moment, nor are the current command structures going to be around for very long as they are being constantly modified and tweaked for optimal results before pulling them into our CLI._

## Flow Logs 
Capture information about the IP traffic going to and from network interfaces in your VPC and are stored in a Cloud Object Storage(COS) bucket 

With this information you are able to: 
- Troubleshoot why specific traffic isn't reaching an instance, which helps to diagnose restrictive security group rules.
- Monitor the traffic that is reaching your instance.
- Adhere to compliance regulations
- Determine the overall health of network monitoring
- Assist with root cause analysis.

## Getting started

### Prerequisites

- Must have node js installed.

- Install node js with `brew install node`.

- Run `npm install readline-sync` in the project directory. This package allows an easy way to obtain user input.
- Run `npm install axios ibm-cos-sdk qs` in the project directory
- Run `npm install chalk clear figlet colors` in the project directory

### Commands

- Use `sudo npm install -g .` to package the program as a global command
- Use `flowlog get` to pull the newest flowlogs
- Use `flowlog parse` to parse the flowlogs
- Use `flowlog scan` to scan logs for errors
- Alternatively, use `flowlog` to choose from any of the above

### How to get your API Key
- Log in to to cloud.ibm.com
- Click "Manage" in the top right menu bar
- Select "Access (IAM)"
- Select "API keys" on the left menu
- You can create a API key in this page, and make sure to store it securely

## Resources

- [IBM Virtual Private Cloud](https://cloud.ibm.com/docs/vpc?topic=vpc-getting-started)
- [IBM Flowlogs (Beta)](https://cloud.ibm.com/docs/vpc?topic=vpc-flow-logs&locale=en)
- [IBM Cloud Object Storage](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-getting-started-cloud-object-storage)