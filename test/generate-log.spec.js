const assert = require('assert');
const fs = require('fs');
const path = require('path');
const generateLog = require('../src/generate-log');

const pathFile = path.resolve(__dirname, '../src', 'logfile.log');

describe('Testing generateLog file', function () {
  it('generateLog', () => {
    this.timeout(1e4);
    return generateLog(1)
      .then((response) => {
        assert.equal(response, true);
        assert.equal(fs.existsSync(pathFile), true);
      })
  });
});