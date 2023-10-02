import { Meteors } from "../db/collections/meteors";

var express = require('express');
var router = express.Router();

/* GET years autocomplete suggestions. */
router.get('/autocomplete', function (req, res, next) {
  const search = req.query.search || "";
  const meteorYears = Meteors.map((meteor) => new Date(meteor.year).getFullYear().toString());

  const uniqueSuggestions = [...new Set(meteorYears)];
  const suggestions = uniqueSuggestions.filter((meteorYear) => meteorYear.includes(search.toString()));

  res.json(suggestions);
});

module.exports = router;

