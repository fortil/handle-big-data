const assert = require('assert');
const fs = require('fs');
const path = require('path');
const logInput = require('../src/index');

let mainLogger = {};

describe('Testing log_input function', () => {
  it('Creating the object', () => {
    return logInput('william', 2000)
      .then((response) => {
        mainLogger = response;
        assert.equal(typeof response.logUnique, 'function');
        assert.equal(typeof response.logSorted, 'function');
        assert.equal(typeof response.logSum, 'function');
        assert.equal(typeof response.totalLines, 'number');
      });
  });

  it('Function logUnique (should be less than total lines)', () => {
    assert.notEqual(mainLogger.logUnique().length, mainLogger.totalLines);
  });

  it('Function logSorted', () => {
    const sorted = mainLogger.logSorted();
    const reverse = mainLogger.logSorted(true);
    assert.deepEqual(sorted[0][0], reverse[reverse.length - 1][0]);
    assert.deepEqual(sorted[sorted.length - 1], reverse[0]);
  });

  it('Function logSum', () => {
    const length = mainLogger.logSum();
    assert.equal(length, mainLogger.logUnique().length);
  });

});