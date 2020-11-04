const { Transform } = require('stream');
const util = require('util');

const MapTags = ([tag, count]) => { 
  return new Transform({
    transform: (data, encoding, cb) => {
      const json = JSON.parse(data.toString());
      json[tag] = count;
      cb(null, JSON.stringify(json));
    }
  });
};

module.exports.MapTags = MapTags;

module.exports.zipEntriesToObjects = ([ tag, count ]) => ({ [tag]: count });
module.exports.keyRequired = (name) => {
	throw new Error(`${name} is required`);
};

// generate array alphabet
const generateAlphabet = (lowerCase) => {
	let alpha = [ ...Array(26) ].map((_, y) => String.fromCharCode(y + 65));
	if (lowerCase) {
		return alpha.map((a) => a.toLocaleLowerCase());
	} else {
		return alpha;
	}
};

module.exports.generateAlphabet = generateAlphabet;

module.exports.getRandomWord = (alphabet) => {
  // num random between 1 and 2 to take the word length
  // because the idea is create repeate records
	const length = Math.floor(Math.random() * 2) + 1;
	const word = [];
	for (let e = 0; e < length; e++) {
		word[e] = alphabet[Math.floor(Math.random() * alphabet.length)]; // random between 0 and alphabet length
	}
	return word.join('');
};
