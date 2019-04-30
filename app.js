const fs = require('fs');
const path = require('path');
const config = require('./config.json');

process.title = 'bibliomap-harvester';

const cache = {};

start().then((logFiles) => {
  if (!process.env.BBH_NO_DEMO) {
    (function write () {
      logFiles.forEach(file => {
        writeInFile(file);
      });
      setTimeout(write, process.env.BBH_DEMO_DELAY || 1000);
    })();
  }
  console.log('Harvester is running');
});

if (process.env.DEBUG) {
  (function checkMemory() {
    const memoryUsage = Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100;
    console.log(`Memory usage: ${memoryUsage} MiB`);
    setTimeout(checkMemory, 5000);
  })();
}

async function start () {
  let logFiles = null;
  try {
    logFiles = await listLogFiles();
  } catch (err) {
    if (process.env.DEBUG) {
      console.error(err);
    }
    return process.exit(1);
  }
  return logFiles;
}

function listLogFiles () {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(`${__dirname}/demo-logs/${process.env.NODE_APP_INSTANCE}`), (err, files) => {
      if (err) {
        return reject(e);
      }
  
      for (let i = 0; i < files.length; i++) {
        if (!fs.existsSync(path.resolve(`${__dirname}/demo-logs/tmp/${files[i]}`))) {
          fs.writeFileSync(path.resolve(`${__dirname}/demo-logs/tmp/${files[i]}`), '');
        }
        if (!cache[files[i]]) {
          cache[files[i]] = fs.readFileSync(path.resolve(`${__dirname}/demo-logs/${process.env.NODE_APP_INSTANCE}/${files[i]}`), 'utf-8').split(/\r?\n/);
        }
      }
      return resolve(files);
    });
  });
}

function writeInFile (file) {
  let line = cache[file][Math.floor(Math.random() * cache[file].length)];

  do {
    line = cache[file][Math.floor(Math.random() * cache[file].length)];
  } while (!line);
  
  if (line) {
    fs.appendFile(path.resolve(`${__dirname}/demo-logs/tmp/${file}`), `${line}\r\n`, (err) => {
      if (err) {
        if (process.env.DEBUG) {
          console.error(err);
        }
        return process.exit(1);
      }
    });
  }
}

function shutdown() {
  console.log('Got a stop signal, shutting down...');
  process.exit(1);
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);