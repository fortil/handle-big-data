const assert = require('assert');
const fs = require('fs');
const path = require('path');
const generateLog = require('../src/generate-log');

const pathFile = path.resolve(__dirname, '../src', 'logfile.log');

describe('Testing generateLog file', () => {
  it('generateLog', () => {
    return generateLog()
      .then((response) => {
        assert.equal(response, true);
        assert.equal(fs.existsSync(pathFile), true);
      })
  });
});