var express = require("express");
var { Meteors } = require("../db/collections/meteors");

const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 30;

var router = express.Router();

/* GET meteors listing with pagination. */
router.get("/", async (req, res) => {
  const meteorRequest = req.query;

  const page = parseInt(meteorRequest.page);
  const perPage = parseInt(meteorRequest?.perPage) || DEFAULT_PER_PAGE;
  const startIndex = 0;
  const endIndex = page * perPage;

  let meteorData = Meteors;
  let currentYear = meteorRequest?.year;

  if (currentYear) {
    const reqYear = parseInt(currentYear);
    meteorData = await meteorData.filter((meteor) => new Date(meteor.year).getFullYear() === reqYear);
  }

  if (meteorRequest?.mass) {
    const mass = parseInt(meteorRequest.mass);
    meteorData = await meteorData.filter((meteor) => parseInt(meteor.mass) > mass);

    if (!meteorData.length && currentYear ) {
      const meteors = Meteors.filter((meteor) => parseInt(meteor.mass) > mass);
      if(meteors.length) {
        const newYear = meteors[0].year;
        meteorData = meteors.filter((meteor) => meteor.year === newYear);
        currentYear = new Date(newYear).getFullYear();
      }
    }
  }

  const totalMeteorCount = meteorData.length;
  const meteorsSubset = meteorData.slice(startIndex, endIndex);

  const response = {
    currentPage: page,
    totalPages: Math.ceil(Meteors.length / perPage) || 1,
    totalMeteors: totalMeteorCount,
    meteors: meteorsSubset,
    currentYear: currentYear,
  };

  res.json(response);
});

module.exports = router;
