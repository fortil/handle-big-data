# Handling big data file

## Features
- Create alphabet (English) random
- Create random logfile
- Insert new log
- Get all logs
- Get unique logs
- Get memory usage in realtime

## How it works
## Test
`npm test`

### Play (example)
```js
const Logger = require('./src/index');
 // you can pass a string to the file log name
 // new Logger('file.log');
 // or an object
 // new Logger({ fileName: 'file.log', emitEachLine: 1e3, ...rest });
 // each many lines do you want to see the logs (1e3 each thounsend lines)
 // rest and object accepted by EventEmitter class
const logger = new Logger({ fileName: 'file.log', emitEachLine: 1e4 });
// to listen the sytem metrics
logger.on('sysinfo', console.log);
// to listen the erors
logger.on('error', console.error);
// to create a random log file
// pass the times to repeat the file creator
logger.createRandomLogFile(5, 'file.log') // will return a promise
// to add new input
logger.logInput('tag', 100)
// will return an object to handle the log
  .then((response) => {
    /*
    { logUniques, logSum, logSorted, totalLines, ...rest } = response
    */
   console.log('array of uniques logs:', response.logUniques());
   console.log('number of total lines:', response.totalLines);
  })
```