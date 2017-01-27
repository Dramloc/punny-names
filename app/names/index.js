const express = require('express');
const names = require('./service');
const url = require('url');
const JSONAPISerializer = require('jsonapi-serializer').Serializer;

const router = new express.Router();

router.get('/', (req, res) => {
  const meta = {};
  if (undefined !== req.query.limit) {
    meta.limit = parseInt(req.query.limit, 10);
  }
  if (undefined !== req.query.offset) {
    meta.offset = parseInt(req.query.offset, 10);
  }
  if (undefined !== req.query.seed) {
    meta.seed = parseInt(req.query.seed, 10);
  }
  const collection = names.generateNames(meta.limit, meta.offset, meta.seed);

  const links = {
    self: url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: url.parse(req.originalUrl).pathname,
      query: meta,
    }),
    next: url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: url.parse(req.originalUrl).pathname,
      query: Object.assign({}, meta, { offset: meta.offset ? meta.offset + 1 : 1 }),
    }),
  };

  if (meta.offset && meta.offset > 0) {
    links.previous = url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: url.parse(req.originalUrl).pathname,
      query: Object.assign({}, meta, { offset: meta.offset - 1 }),
    });
  }

  const NameSerializer = new JSONAPISerializer('names', {
    topLevelLinks: links,
    meta,
    attributes: ['first', 'last'],
  });

  return res.json(NameSerializer.serialize(collection));
});

router.get('/:id', (req, res) => {
  const meta = {};
  if (undefined !== req.query.seed) {
    meta.seed = parseInt(req.query.seed, 10);
  }
  const index = parseInt(req.params.id, 10);
  const links = {
    self: url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: url.parse(req.originalUrl).pathname,
      query: meta,
    }),
  };

  const NameSerializer = new JSONAPISerializer('names', {
    topLevelLinks: links,
    meta,
    attributes: ['first', 'last'],
  });

  return res.json(NameSerializer.serialize(names.generateName(index, meta.seed)));
});

module.exports = router;
