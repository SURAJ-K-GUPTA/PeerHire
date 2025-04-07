const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    title: String,
    description: String,
    budget: Number,
    duration: Number,
    skillsRequired: [String],
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  });
  
const Job = mongoose.model("Job", JobSchema);

module.exports = Job;