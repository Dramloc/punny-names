const express = require('express');
const words = require('./service');

const router = new express.Router();

router.get('/', (req, res) => res.json(words.db));

module.exports = router;
