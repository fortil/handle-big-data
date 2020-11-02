// generate array alphabet
const generateAlphabet = (lowerCase) => {
  let alpha = [...Array(26)].map((_, y) => String.fromCharCode(y + 65));
  if (lowerCase) {
    return alpha.map(a => a.toLocaleLowerCase());
  } else {
    return alpha;
  }
};

module.exports.generateAlphabet = generateAlphabet;

module.exports.getRandomWord = (alphabet) => {
  // num random between 1 and 5 to take the word length
  const length = Math.floor(Math.random() * 3) + 1;
  const word = [];
  for (let e = 0; e < length; e++) {
    word[e] = alphabet[Math.floor(Math.random() * alphabet.length)]; // random between 0 and alphabet length
  }
  return word.join('');
}
