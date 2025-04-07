const express = require("express");
const { bidPlaceController, getBidsController, bidStatusController } = require("../controllers/bid");
const { verifyEmployer } = require("../utils/Auth");
const bidRouter = express.Router();

bidRouter.post("/:jobId", bidPlaceController)
.get("/:jobId", getBidsController)
.patch("/:bidId/:status", verifyEmployer, bidStatusController)


module.exports = bidRouter;