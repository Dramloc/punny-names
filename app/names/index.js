const express = require('express');
const names = require('./service');

const router = new express.Router();

router.get('/', (req, res) => {
  const seed = parseInt(req.query.seed, 10);
  const offset = parseInt(req.query.offset, 10);
  const limit = parseInt(req.query.limit, 10);

  return res.json(names.generateNames(limit, offset, seed));
});

router.get('/:id', (req, res) => {
  const index = parseInt(req.params.id, 10);
  const seed = parseInt(req.query.seed, 10);

  return res.json(names.generateName(index, seed));
});

module.exports = router;
