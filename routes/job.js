const express = require("express");

const { verifyEmployer } = require("../utils/Auth");
const { createJobController, getAllJobsController, getJobByIdController } = require("../controllers/job");

const jobRouter = express.Router();

jobRouter.post("/create", verifyEmployer, createJobController)
.get("/", getAllJobsController)
.get("/:jobId", getJobByIdController)

module.exports = jobRouter;