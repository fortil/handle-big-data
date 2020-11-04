const fs = require('fs');
const path = require('path');
const { generateAlphabet, getRandomWord } = require('./utils');

const alphabet = generateAlphabet(true);

/**
 * WriteOneMillionTimes
 * @param {WritableStream} writer writable stream object
 * @param {function} callback function that will be exected after write the last line
 */
const writeOneMillionTimes = (writer, callback) => {
  let i = 2e4; // you can up this number
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Last time!
        writer.write(`william=2000\n`);
        callback();
      } else {
        const data = `${getRandomWord(alphabet)}=${Math.floor(Math.random() * 20)}\n`;
        ok = writer.write(data);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write();
}

async function start(times = 8, fileName = 'logfile.log') {
  try {
    // name of file
    const pathFile = path.resolve(__dirname, fileName);
    const writer = fs.createWriteStream(pathFile, { flags: 'a' });
    for (let i = 0; i < times; i++) {
      await new Promise((resolved) => writeOneMillionTimes(writer, resolved));
    }
    writer.close();
    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
}
module.exports = start;