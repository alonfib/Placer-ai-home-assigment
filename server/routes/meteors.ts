var express = require('express');
var { Meteors } = require('../db/collections/meteors');

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;

var router = express.Router();

/* GET meteors listing with pagination. */
router.get('/', (req, res) => {
  const meteorRequest = req.query;
  // console.log("req: ", req);

  const page = parseInt(meteorRequest.page);
  const perPage = parseInt(meteorRequest?.perPage) || DEFAULT_PER_PAGE;

  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  let meteorData = Meteors;

  if(meteorRequest?.year) {
    const formattedDate = new Date(meteorRequest.year, 0, 0, 0, 0, 0, 0);
    console.log("formattedDate", formattedDate)
    meteorData = meteorRequest?.year ? Meteors.filter((meteor) => meteor.year === formattedDate): Meteors;
  }

  const meteorsSubset = meteorData.slice(startIndex, endIndex);

  const response = {
    meteors: meteorsSubset,
    currentPage: page,
    totalPages: Math.ceil(Meteors.length / perPage) || 1,
  };

  res.json(response);
});

module.exports = router;
