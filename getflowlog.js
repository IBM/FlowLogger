const https = require("https");
const http = require("http");
const fs = require("fs");
const myCOS = require("ibm-cos-sdk");
const { gzip, ungzip } = require("node-gzip");

const intervalInMinutes = 15;

processReport();

async function processReport() {
  try {
    var marker;

    try {
      var markerFile = fs.readFileSync(
        "/Users/bokaili/flow/flow-markers",
        "UTF-8"
      );

      marker = JSON.parse(markerFile);
    } catch (err) {
      console.log("Can't open file -- creating empty marker");
      marker = {};
    }

    console.log(marker);

    // read contents of the file
    const data = fs.readFileSync("/Users/bokaili/flow/flow-data", "UTF-8");

    // split the contents by new line
    const lines = data.split(/\r?\n/);

    // each line is:
    // client
    // endpoint
    // apikeyId
    // ibmAuthendpoint
    // serviceinstance
    // env

    marker = await processClientData(lines, marker);

    console.log("new marker file = " + marker);

    fs.writeFile(
      "/Users/bokaili/flow/flow-markers",
      JSON.stringify(marker),
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log("Marker file was updated");
      }
    );
  } catch (err) {
    console.error(err);
  }
}

async function processClientData(lines, marker) {
  return new Promise(async function (resolve, reject) {
    console.log("Total Lines to Process: ", lines.length);
    for (var i = 0; i < lines.length - 1; i++) {
      console.log("Processing Line ", i);
      marker = await processClient(lines[i], marker);
    }
    console.log(JSON.stringify(marker));
    resolve(marker);
  });
}

function addMinutes(date, minutes) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes() + minutes,
    date.getSeconds(),
    date.getMilliseconds()
  );
}

function processClient(clientData, marker) {
  return new Promise(async function (resolve, reject) {
    line = clientData.replace(/\n/gm, "");
    lineParams = clientData.split(",");

    client = lineParams[0];
    env = lineParams[5];

    var config = {
      endpoint: lineParams[1],
      apiKeyId: lineParams[2],
      ibmAuthEndpoint: lineParams[3],
      serviceInstanceId: lineParams[4],
    };

    var cosClient = new myCOS.S3(config, client, env);

    if (typeof marker[client] == "undefined") {
      lastUpdate = addMinutes(new Date(), -intervalInMinutes)
        .getTime()
        .toString();
    } else {
      lastUpdate = marker[client];
      console.log("Found marker for client: " + lastUpdate);
    }

    console.log("Processing all new requests since " + lastUpdate);

    lastUpdateFound = await getBuckets(cosClient, client, env, lastUpdate);

    if (lastUpdateFound != 0) marker[client] = lastUpdateFound;
    resolve(marker);
  });
}

function getBucketList(cos) {
  return new Promise(function (resolve, reject) {
    cos.listBuckets(function (err, data) {
      resolve(data);
    });
  });
}

async function getObjects(cos, bucket, lastKey) {
  return new Promise(function (resolve, reject) {
    cos.listObjects(
      { Bucket: bucket, MaxKeys: 1000, Marker: lastKey },
      function (err, data) {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(data);
      }
    );
  });
}

async function getData(cos, bucket, key) {
  return new Promise(function (resolve, reject) {
    cos.getObject({ Bucket: bucket, Key: key }, function (err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(data);
    });
  });
}
async function getBuckets(cos, client, env, lastUpdate) {
  let buckets = await getBucketList(cos);

  //	console.log(JSON.stringify(buckets));

  compareTime = new Date(parseInt(lastUpdate));

  var objectsFound = 0;
  var lastKey = "";
  var latestUpdateTime = 0;

  for (i = 0; i < buckets.Buckets.length; i++) {
    l = 0;
    do {
      let objects = await getObjects(cos, buckets.Buckets[i].Name, lastKey);
      objectsFound = objects.Contents.length;
      console.log(
        "Checking batch of " +
          objectsFound +
          " objects from bucket - page " +
          l++
      );
      for (j = 0; j < objects.Contents.length; j++) {
        lastKey = objects.Contents[j].Key;
        if (objects.Contents[j].LastModified.getTime() > compareTime) {
          if (objects.Contents[j].LastModified.getTime() > latestUpdateTime)
            latestUpdateTime = objects.Contents[j].LastModified.getTime();
          let objectData = await getData(
            cos,
            objects.Name,
            objects.Contents[j].Key
          );
          let decompressed = await ungzip(Buffer.from(objectData.Body));
          logEntry = JSON.parse(decompressed);
          console.log(
            "Getting object - " +
              objects.Name +
              " key " +
              objects.Contents[j].Key
          );
          console.log(
            "Found new entry - Object Last Modified Time: " +
              objects.Contents[j].LastModified.getTime()
          );
          console.log(
            "Number of Flow Logs in Object: " + logEntry.number_of_flow_logs
          );
          for (k = 0; k < logEntry.number_of_flow_logs; k++) {
            lastUpdate = objects.Contents[i].LastModified.getTime();
            thisEntry = logEntry.flow_logs[k];
            esObject = new Object(thisEntry);
            esObject["customer"] = client;
            esObject["beginTime"] = new Date(esObject.start_time).getTime();
            esObject["endTime"] = new Date(esObject.end_time).getTime();
            esObject["beginFlowTime"] = new Date(
              esObject.connection_start_time
            ).getTime();
            esObject["env"] = env;
            esObject["targetAndPort"] =
              logEntry.flow_logs[k].target_ip +
              ":" +
              logEntry.flow_logs[k].target_port;
            console.log(JSON.stringify(esObject));
          }
        }
      }
    } while (objectsFound > 0);
  }
  return latestUpdateTime;
}

function decompress(msg) {
  return new Promise((resolve, reject) => {
    zlib.inflate(msg, (err, buffer) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(buffer);
    });
  });
}

function postToElasticSearch(data) {
  return new Promise(function (resolve, reject) {
    const options = {
      hostname: "169.61.226.114",
      port: 9200,
      path: "/flow-data/_doc/",
      method: "POST",
      auth: "elastic:ThclAIOInaAO6YmUzkuv",
      headers: { "Content-Type": "application/json" },
    };

    const req = http.request(options, (res) => {
      res.on("data", (d) => {
        //	    		process.stdout.write(d);
      });

      res.on("end", () => {
        resolve();
      });
    });

    req.on("error", (error) => {
      console.error(error);
      reject();
    });

    req.write(data);
    req.end();
  });
}
