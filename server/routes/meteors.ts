var express = require('express');
const { Meteors } = require('../db/collections/meteors');
var router = express.Router();

/* GET users listing. */
// TODO: add pagination.
router.get('/meteors', function(req, res, next) {
  res.send(Meteors);
});

module.exports = router;
