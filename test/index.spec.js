const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Logger = require('../src/index');

const logFileName = 'logfile.log';
const logPathFile = path.resolve(__dirname, '../src', logFileName);
let logger = {};
let logResponse = {};

describe('Testing logger function', function () {
  it('Generate log file', function () {
    this.timeout(1e8);
    return Logger.createRandomLogFile(1, logFileName)
      .then(() => {
        assert.equal(fs.existsSync(logPathFile), true);
      })
  });

  it('Insert a log', () => {
    logger = new Logger({ FileName: logFileName, emitEachLine: 1e3 })
    return logger.logInput('william', 2000)
      .then((response) => {
        logResponse = response;
        assert.equal(typeof response.logUniques, 'function');
        assert.equal(typeof response.logSorted, 'function');
        assert.equal(typeof response.logSum, 'function');
        assert.equal(typeof response.totalLines, 'number');
      });
  });

  it('Function logUnique (should be less than total lines)', () => {
    assert.notEqual(logResponse.logUniques().length, logResponse.totalLines);
  });

  it('Function logSorted', () => {
    const sorted = logResponse.logSorted();
    const reverse = logResponse.logSorted(true);
    assert.deepEqual(sorted[0], reverse[reverse.length - 1]);
    assert.deepEqual(sorted[sorted.length - 1], reverse[0]);
  });

  it('Function logSum', () => {
    assert.equal(typeof logResponse.logSum(), 'number');
  });

});