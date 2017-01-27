/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const winston = require('winston');
const Syllables = require('../syllables/service');
const Words = require('../words/service');

const logger = winston.loggers.get('words');
const db = fs.readFileSync('./data/names.txt', 'utf-8').toString().split('\n');
logger.info(`${db.length} names loaded`);

const defaults = {
  $limit: 10,
  $skip: 0,
  seed: 1234,
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
  const lastNameFirstSyllable = Syllables.first(lastName);
  return db.find(firstName => Syllables.isSamePronunciation(
    Syllables.last(firstName),
    lastNameFirstSyllable));
}

/**
 * Generate a punny name
 * @param {number} id - the name identifier
 * @param {Object} query - the query parameters
 * @param {number} query.seed - the generator seed
 * @return {Name} - the generated punny name
 */
function generateName(id, query) {
  const lastName = Words.db[randomize(id, query.seed) % Words.db.length];
  const firstName = generateFirstName(lastName);
  const lastNameSyllables = Syllables.tokenize(lastName);
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
 * @param {Object} [query] - the query parameters
 * @param {number} [query.seed=1234] - the generator seed
 * @return {Name} - the generated punny name
 */
function findById(id, query) {
  return generateName(id, Object.assign({}, defaults, query));
}

/**
 * Generate a set of punny names
 * @param {Object} query - the query parameters
 * @param {number} query.$limit - the number of names generated
 * @param {number} query.$skip - the pagination offset
 * @param {number} query.seed - the generator seed
 * @return {Name[]} - the generated array of names
 */
function generateNames(query) {
  const names = [];
  const from = query.$skip + 1;
  const to = from + query.$limit;
  for (let id = from; id < to; id += 1) {
    names.push(generateName(id, query));
  }
  return names;
}

/**
 * Generate a set of punny names
 * @param {Object} query - the query parameters
 * @param {number} [query.$limit=10] - the number of names generated
 * @param {number} [query.$skip=0] - the pagination offset
 * @param {number} [query.seed=1234] - the generator seed
 * @return {Name[]} - the generated array of names
 */
function find(query) {
  return generateNames(Object.assign({}, defaults, query));
}

module.exports = {
  findById,
  find,
};
