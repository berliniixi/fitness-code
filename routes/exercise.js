const express = require("express");
const router = express.Router();
const dynamicEndpointMiddleware = require("../middleware/Redis/dynamicEndpoint");
const fetchAndCacheData = require("../controllers/exercise");

router.get(
  "/:endpoint/:dynamic?",
  dynamicEndpointMiddleware,
  fetchAndCacheData
);
module.exports = router;
