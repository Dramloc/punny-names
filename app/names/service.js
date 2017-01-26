/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const winston = require('winston');
const syllables = require('../syllables/service');
const words = require('../words/service');

const logger = winston.loggers.get('words');
const db = fs.readFileSync('./data/names.txt', 'utf-8').toString().split('\n');
logger.info(`${db.length} names loaded`);

const defaults = {
  seed: 1234,
  offset: 0,
  limit: 10,
};

function randomize(id, seed) {
  return (id + 1234) * seed;
}

/**
 * Generate first name matching given last name
 * @param {string} lastName - a last name
 * @return {string} - the generated first name
 */
function generateFirstName(lastName) {
  const lastNameFirstSyllable = syllables.first(lastName);
  return db.find(firstName => syllables.isSamePronunciation(
    syllables.last(firstName),
    lastNameFirstSyllable));
}

/**
 * Generate a punny name
 * @param {number} id - the name identifier
 * @param {number} seed - the generator seed
 * @return {Name} - the generated punny name
 */
function _generateName(id, seed) {
  const lastName = words.db[randomize(id, seed) % words.db.length];
  const firstName = generateFirstName(lastName);

  if (undefined === firstName) {
    words.db.splice(randomize(id, seed) % words.db.length, 1);
  }
  const lastNameSyllables = syllables.tokenize(lastName);
  lastNameSyllables.shift();
  return {
    id,
    first: firstName,
    last: lastNameSyllables.join(''),
  };
}

/**
 * Generate a punny name
 * @param {number} id - the name identifier
 * @param {number} [seed=1234] - the generator seed
 * @return {Name} - the generated punny name
 */
function generateName(id, seed) {
  return _generateName(id, seed || defaults.seed);
}

/**
 * Generate a set of punny names
 * @param {number} limit - the number of names generated
 * @param {number} offset - the pagination offset
 * @param {number} seed - the generator seed
 * @return {Name[]} - the generated array of names
 */
function _generateNames(limit, offset, seed) {
  const names = [];
  const from = (offset * limit) + 1;
  const to = from + limit;
  for (let id = from; id < to; id += 1) {
    names.push(_generateName(id, seed));
  }
  return names;
}

/**
 * Generate a set of punny names
 * @param {number} [limit=10] - the number of names generated
 * @param {number} [offset=0] - the pagination offset
 * @param {number} [seed=1234] - the generator seed
 * @return {Name[]} - the generated array of names
 */
function generateNames(limit, offset, seed) {
  return _generateNames(limit || defaults.limit, offset || defaults.offset, seed || defaults.seed);
}

module.exports = {
  generateName,
  generateNames,
};
