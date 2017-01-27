const express = require('express');
const Name = require('./service');

const router = new express.Router();

router.get('/', (req, res) => {
  const query = {};
  if (undefined !== req.query.limit) {
    query.$limit = parseInt(req.query.limit, 10);
  }
  if (undefined !== req.query.skip) {
    query.$skip = parseInt(req.query.skip, 10);
  }
  if (undefined !== req.query.seed) {
    query.seed = parseInt(req.query.seed, 10);
  }
  return res.json(Name.find(query));
});

router.get('/:id', (req, res) => {
  const index = parseInt(req.params.id, 10);
  const query = {};
  if (undefined !== req.query.seed) {
    query.seed = parseInt(req.query.seed, 10);
  }
  return res.json(Name.findById(index, query));
});

module.exports = router;
