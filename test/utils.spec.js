const assert = require('assert');
const utils = require('../src/utils');

describe('Testing utils', () => {

  it('generateAlphabet', () => {
    assert.deepEqual(utils.generateAlphabet(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
  });

  it('getRandomWord', () => {
    const alphabet = utils.generateAlphabet();
    assert.match(utils.getRandomWord(alphabet), new RegExp('\s*', 'ig'));
  })
});