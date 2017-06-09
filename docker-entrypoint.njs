#!/usr/bin/env node

// override the config.json with ENV variables
var config = require('./config.json');
var configIstex = require('./config-istex.json');
var configCnrs = require('./config-cnrs.json');

  

 

  switch(process.env.NODE_APP_INSTANCE){
  case "istex":
    config.logStreams = configIstex.logStreams;
    break;
  case "cnrs":
    config.logStreams = configCnrs.logStreams;
    break;
  }




if (process.env.BBH_ENRICHER_HOST) {
  config.server.host = process.env.BBH_ENRICHER_HOST;
}
if (process.env.BBH_ENRICHER_PORT) {
  config.server.port = process.env.BBH_ENRICHER_PORT;
}

if (process.env.BBH_STREAMNAMES && process.env.BBH_STREAMPATHS) {
  var bbhStreamNames = process.env.BBH_STREAMNAMES.split(' ');
  var bbhStreamPaths = process.env.BBH_STREAMPATHS.split(' ');
  
  config.logStreams = {};
  bbhStreamNames.forEach(function (streamName, idX) {
    config.logStreams[streamName] = [ bbhStreamPaths[idX] ];
  });
}


const fs = require('fs');
fs.writeFileSync(__dirname + '/config.local.json', JSON.stringify(config, null, '  '));

// run the harvester and the fake logs demo
const spawn = require('child_process').spawn;
const start_process = spawn('npm', process.env.BBH_NO_DEMO ? [ 'start' ] : [ 'run', 'start-demo' ]);
start_process.stdout.pipe(process.stdout);
start_process.stderr.pipe(process.stderr);
