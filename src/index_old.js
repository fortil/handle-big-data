const fs = require('fs');
const path = require('path');
const readline = require('readline');
const stream = require('stream');

const pathFile = path.resolve(__dirname, './logfile.log');

/**
 * 
 * @param {string} inputTag string to save if is repeated
 * @param {number} inputCount number of the log
 * @returns {Promise} returns a promise that have an object 
 */
const logInput = (inputTag, inputCount) => new Promise((resolve, reject) => {
  const outstream = new stream();
  const instream = fs.createReadStream(pathFile);
  const rl = readline.createInterface(instream, outstream);
  
  // save all uniques tags
  const uniqueTags = {};
  const tags = {};
  // catch the last line
  const lastLine = { tag: '', count: 0, line: 0 };
  // count the total lines
  let lineCount = 0;

  const sortFn = (reverse = false) => (a, b) => {
    if (a[0] > b[0]) {
      return reverse ? -1 : 1;
    }
    if (a[0] < b[0]) {
      return reverse ? 1 : -1;
    }
    return 0;
  }

  // object to be sent
  const response = (entries) => ({
    entries,
    logUnique: () => {
      return Object.entries(entries);
    },
    logSorted: (reverse) => {
      return Object.entries(entries).sort(sortFn(reverse))
    },
    logSum: () => {
      return Object.keys(entries).length;
    },
    totalLines: lineCount,
  });

  rl.on('line', (line) => {
    lineCount++;
    const [tag, count] = line.split('=');

    if (tag === inputTag) {
      lastLine.tag = tag;
      lastLine.count = inputCount;
      lastLine.line = lineCount;
    }
    tags[tag] = count;
  });

  rl.on('error', reject);

  rl.on('close', () => {
    if (lastLine.tag !== '' && lastLine.line === lineCount) {
      const l = fs.createWriteStream(pathFile, { flags: 'a' });
      l.write(`${lastLine.tag}=${lastLine.count}\n`);
      l.close();
    }
    resolve(response(tags));
  });
  
});

logInput('i', 1).then((response) => {
  console.log(response);
});

module.exports = logInput;