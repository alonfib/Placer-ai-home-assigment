const express = require('express');
const { Meteors } = require('../db/collections/meteors');
const { IMeteor, MeteorsResponse } = require('../types');

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

const router = express.Router();

/* GET meteors listing with pagination. */
router.get('/meteors', (req, res) => {
  const page = parseInt(req.query.page) || DEFAULT_PAGE;
  const perPage = parseInt(req.query.perPage) || DEFAULT_PER_PAGE;

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  const meteorsSubset = Meteors.slice(startIndex, endIndex);

  const response = {
    meteors: meteorsSubset,
    currentPage: page,
    totalPages: Math.ceil(Meteors.length / perPage) || 1,
  };

  res.json(response);
});

module.exports = router;
