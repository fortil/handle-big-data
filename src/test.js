const fs = require('fs');
const readline = require('readline');
const path = require('path');
const stream = require('stream');

const pathFile = path.resolve(__dirname, './logfile.log');
const pathTempFile = path.resolve(__dirname, './logfile-temp.log');

const outputFile = fs.createWriteStream(pathTempFile);
const inputFile = fs.createWriteStream(pathFile);

const rl = readline.createInterface({ input: inputFile,  output: new stream() });

// Handle any error that occurs on the write stream
outputFile.on('err', (err) => {
	// handle error
	console.log(err);
});

// Once done writing, rename the output to be the input file name
outputFile.on('close', () => {
	console.log('done writing');

	fs.rename(pathTempFile, pathFile, (err) => {
		if (err) {
			// handle error
			console.log(err);
		} else {
			console.log('renamed file');
		}
	});
});

// Read the file and replace any text that matches
rl.on('line', (line) => {
  let text = line;
  const [tag, count] = line.split('=');
  // Do some evaluation to determine if the text matches
  if (tag === 'i') {
    text = `${tag}=${+count + 1}`;
  }
	// write text to the output file stream with new line character
	outputFile.write(`${text}\n`);
});

// Done reading the input, call end() on the write stream
rl.on('close', () => {
	outputFile.end();
});
