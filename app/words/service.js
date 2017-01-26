const fs = require('fs');
const winston = require('winston');

const logger = winston.loggers.get('words');
const db = fs.readFileSync('./data/words.txt', 'utf-8').toString().split('\n');
logger.info(`${db.length} words loaded`);

module.exports = {
  db,
};
