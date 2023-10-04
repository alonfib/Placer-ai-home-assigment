import { MeteorsResponse } from "../types";

var express = require("express");
var { Meteors } = require("../db/collections/meteors");

const ITEMS_PER_FETCH = 30;

var router = express.Router();

/* GET meteors listing with pagination. */
router.get("/", async (req, res) => {
  const meteorRequest = req.query;

  const page = parseInt(meteorRequest.page);
  const startIndex = 0;
  const endIndex = page * ITEMS_PER_FETCH;

  let meteorData = Meteors;
  let currentYear = meteorRequest?.year;

  if (currentYear) {
    const reqYear = parseInt(currentYear);
    meteorData = meteorData.filter((meteor) => new Date(meteor.year).getFullYear() === reqYear);
  }

  if (meteorRequest?.mass) {
    const mass = parseInt(meteorRequest.mass);
    meteorData = meteorData.filter((meteor) => parseInt(meteor.mass) > mass);

    // If we check for mass and there are no results for the year, we should check for the next year with results.
    if (!meteorData.length && currentYear) {
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

  const response: MeteorsResponse = {
    meteors: meteorsSubset,
    totalMeteors: totalMeteorCount,
    currentYear: currentYear,
  };

  res.json(response);
});

module.exports = router;
