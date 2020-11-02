const fs = require('fs');
const path = require('path');
const { generateAlphabet, getRandomWord } = require('./utils');

const pathFile = path.resolve(__dirname, 'logfile.log');

const writer = fs.createWriteStream(pathFile, { flags: 'a' });

const alphabet = generateAlphabet(true);

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

module.exports = async () => {
  try {
    for (let i = 0; i < 8; i++) {
      await new Promise((resolved) => writeOneMillionTimes(writer, resolved));
    }

    writer.close();
    return true;

  } catch (error) {
    console.log(error);
    return false;
  }
}

