const fs = require('fs');
const readline = require('readline');
const path = require('path');
const stream = require('stream');
const { EventEmitter } = require('events');

const { MapTags, zipEntriesToObjects, keyRequired } = require('./utils');
const createRandomLogFile = require('./generate-log');

// const uniqFile = path.resolve(__dirname, 'uniques.txt');
// const uniqFileTmp = path.resolve(__dirname, 'uniques-tmp.txt');

class Logger extends EventEmitter {
	constructor(props) {
		super(props);
		let config = { emitEachLine: 1, fileName: 'logfile.log' };
		if (typeof props === 'string') {
			config.fileName = props;
		} else if (typeof props === 'object') {
			config = { ...config, ...props };
		}
		// path of the file and temp log
		this.pathTempFile = path.resolve(__dirname, 'temp.log');
		this.emitEachLine = config.emitEachLine;
		this.totalLines = 0;
		this.startTime = Date.now();
		this.pathFile = path.resolve(__dirname, config.fileName);
		this.uniques = {};
	}

	/**
   * 
   * @param {String} inputTag tag to found or add
   * @param {Count} inputCount count of tag logged
   */
	logInput = (inputTag = keyRequired('tag'), inputCount = keyRequired('count')) => {
		// start time to process
		this.startTime = Date.now();
		// to check the repeated tag
		let tagRepeated = false;
		// stream temp
		const outputFile = fs.createWriteStream(this.pathTempFile);
		// handle outputFile error and emit it
		outputFile.on('error', (error) => {
			this.emit('error', error);
		});

		// Once done writing, rename the output to be the input file name
		// and return a promise to be handled
		// this is because we need to know when it end to use the others features
		const endProcess = new Promise((resolve, reject) =>
			outputFile.on('close', () => {
				fs.rename(this.pathTempFile, this.pathFile, (err) => {
					// handle error and emit it
					if (err) {
						this.emit('error', error);
						reject(error);
					} else {
						resolve(this);
					}
				});
			})
		);

		// input stream
		const inputFile = fs.createReadStream(this.pathFile);
		// readline
		const rl = readline.createInterface({ input: inputFile, output: new stream() });

		rl.on('line', (line) => {
			let text = line;
			this.totalLines += 1;

			const [ tag, count ] = text.split('=');
			// Do some evaluation to determine if the text matches
			if (inputTag === tag) {
				// and tag is not added yet
				text = `${tag}=${+count + inputCount}`;
				tagRepeated = true;
			}
			// write text to the output file stream with new line character
			outputFile.write(`${text}\n`);

			// to process the unique keys
			this.handleUnique(tag, +count);
			this.metrics(text);
		});

		// Done reading the input, call end() on the write stream
		rl.on('close', () => {
			// if we didn't find the tag we need to add it at end
			if (tagRepeated === false) {
				outputFile.write(`${inputTag}=${inputCount}\n`);
				this.handleUnique(inputTag, +inputCount);
			}
			this.metrics('ending');
			outputFile.end();
		});

		return endProcess;
	};

	/**
   * 
   * @param {String} tag 
   * @param {Number} count 
   */
	handleUnique = (tag, count) => {
		// the last empty line can come
		if (tag) {
      // if (fs.existsSync(uniqFile)) {
      //   // keeping the last tag for the unique keys
      //   const r = fs.createReadStream(uniqFile);
      //   const w = fs.createWriteStream(uniqFileTmp);

      //   r.pipe(MapTags([tag, count])).pipe(w)
      //     .on('end', () => {
      //       w.close();
      //       fs.renameSync(uniqFileTmp, uniqFile);
      //     })
      //     .on('error', (error) => {
      //       this.emit('error', error);
      //     });
      // } else {
      //   fs.writeFileSync(uniqFile, JSON.stringify({ [tag]: count }));
      // }
			this.uniques[tag] = count;
		}
	};

	/**
   * @returns {[{tag: count}]}
   */
	logUniques = () => {
		return Object.entries(this.uniques).map(zipEntriesToObjects);
	};

	/**
   * @param {Boolean} reverse
   * @returns {[{tag: count}]}
   */
	logSorted = (reverse = false) => {
		const sortFn = (reverse = false) => (a, b) => {
			if (a[0] > b[0]) {
				return reverse ? -1 : 1;
			}
			if (a[0] < b[0]) {
				return reverse ? 1 : -1;
			}
			return 0;
		};

		return Object.entries(this.uniques).sort(sortFn(reverse)).map(zipEntriesToObjects);
	};

	/**
   * @returns {Number}
   */
	logSum = () => {
		return Object.values(this.uniques).reduce((prev, curr) => prev + curr, 0);
	};

	metrics = (msg) => {
		if (this.totalLines % this.emitEachLine === 0) {
			const { heapUsed, heapTotal } = process.memoryUsage();
			const heap = `heapUsed: ${Math.round(heapUsed / 1024 / 1024 * 100) / 100} MB`;
			const heapT = `heapTotal: ${Math.round(heapTotal / 1024 / 1024 * 100) / 100} MB`;
			const text = `text: ${msg}`;
			const line = `line: ${this.totalLines}`;
			const strChain = `${heap}, ${heapT}, ${text}, ${line}`;
			this.emit('sysinfo', `${strChain}`);
			if (msg === 'ending') {
				const finalTime = (Date.now() - this.startTime) / 1e3;
				this.emit('sysinfo', `Time to process: ${finalTime}s`);
			}
		}
  };
  
  static createRandomLogFile = (times = 1, logFileName) => {
    return createRandomLogFile(times, logFileName);
  }
  
  createRandomLogFile = (times = 1) => {
    return createRandomLogFile(times, this.pathFile);
  }
}

const logger = new Logger();
logger.createRandomLogFile(1);
module.exports = Logger;
