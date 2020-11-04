const fs = require('fs');
const readline = require('readline');
const path = require('path');
const stream = require('stream');
const { EventEmitter } = require('events');

const zipEntriesToObjects = ([tag, count]) => ({ [tag]: count });
const keyRequired = (name) => {
  throw new Error(`${name} is required`);
}

class Logger extends EventEmitter {
  constructor(props) {
    super(props);
    let config = { emitEachLine: 1, fileName: 'logfile.log'  };
    if (typeof props === 'string') {
      config.fileName = props;
    } else if (typeof props === 'object') {
      config = { ...config, ...props };
    }
    // path of the file and temp log
    this.pathFile = path.resolve(__dirname, config.fileName);
    this.pathTempFile = path.resolve(__dirname, './temp.log'); 
    this.uniques = {};
    this.totalLines = 0;
    this.emitEachLine = config.emitEachLine;
  }
  
  /**
   * 
   * @param {String} inputTag tag to found or add
   * @param {Count} inputCount count of tag logged
   */
  logInput(inputTag = keyRequired('tag'), inputCount = keyRequired('count')) {
    let tagRepeated = false;
    // temp stream
    const outputFile = fs.createWriteStream(this.pathTempFile);
    // handle outputFile error and emit it
    outputFile.on('error', (error) => {
      this.emit('error', error);
    });

    // Once done writing, rename the output to be the input file name
    // and return a promise to be handled
    // this is because we need to know when it end to use the others features
    const endProcess = new Promise((resolve, reject) => outputFile.on('close', () => {    
      fs.rename(this.pathTempFile, this.pathFile, (err) => {
        if (err) {
          // handle error and emit it
          this.emit('error', error);
          reject(error);
        } else {
          resolve(this);
        }
      });
    }));

    // input stream
    const inputFile = fs.createReadStream(this.pathFile);
    // readline
    const rl = readline.createInterface({ input: inputFile,  output: new stream() });

    rl.on('line', (line) => {
      let text = line;
      this.totalLines += 1;

      const [tag, count] = text.split('=');
      // Do some evaluation to determine if the text matches
      if (inputTag === tag) {
        // and tag is not added yet
        text = `${tag}=${+count + inputCount}`;
        tagRepeated = true;
      }
      // write text to the output file stream with new line character
      outputFile.write(`${text}\n`);
      
      // to process the unique keys
      this.handleUnique(tag, +count);
      this.metrics(text);
    });

    // Done reading the input, call end() on the write stream
    rl.on('close', () => {
      // if we didn't find the tag we need to add it at end
      if (tagRepeated === false) {
        outputFile.write(`${inputTag}=${inputCount}\n`);
        this.handleUnique(inputTag, +inputCount);
      }
      this.metrics('ending');
      outputFile.end();
    });
    
    return endProcess;
  }

  /**
   * 
   * @param {String} tag 
   * @param {Number} count 
   */
  handleUnique(tag, count) {
    // the last empty line can come
    if (tag) {
      // keeping the last tag for the unique keys
      this.uniques[tag] = count;
    }
  }

  /**
   * @returns {[{tag: count}]}
   */
  logUniques = () => {
    return Object.entries(this.uniques).map(zipEntriesToObjects);
  }

  /**
   * @param {Boolean} reverse
   * @returns {[{tag: count}]}
   */
  logSorted = (reverse = false) => {
    const sortFn = (reverse = false) => (a, b) => {
      if (a[0] > b[0]) {
        return reverse ? -1 : 1;
      }
      if (a[0] < b[0]) {
        return reverse ? 1 : -1;
      }
      return 0;
    }

    return Object.entries(this.uniques).sort(sortFn(reverse)).map(zipEntriesToObjects);
  }

  /**
   * @returns {Number}
   */
  logSum = () => {
    return Object.values(this.uniques).reduce((prev, curr) => prev + curr, 0);
  }

  metrics = (msg) => {
    if (this.totalLines % this.emitEachLine === 0) {
      const { heapUsed, heapTotal, ...rest } = process.memoryUsage();
      const heap = `heapUsed: ${Math.round(heapUsed/1024/1024 * 100) / 100} MB`;
      const heapT = `heapTotal: ${Math.round(heapTotal/1024/1024 * 100) / 100} MB`;
      const text = `text: ${msg}`;
      const line = `line: ${this.totalLines}`;
  
      this.emit('sysinfo', `${heap}, ${heapT}, ${text}, ${line}`);
    }
  }
}

// const logger = new Logger({ emitEachLine: 2 });
// logger.on('error', console.warn);
// logger.on('sysinfo', console.info)
// const log = logger.logInput('v', 100);

// log.then(({ logUniques, logSum, logSorted }) => {
//   console.log(logUniques())
//   console.log(logSum())
//   console.log(logSorted(true))
// });

module.exports = Logger