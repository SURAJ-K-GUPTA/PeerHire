const mongoose = require("mongoose");
const BidSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bidAmount: Number,
    timeline: Number,
    message: String,
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  });
  
  const Bid = mongoose.model("Bid", BidSchema);
  
  module.exports = Bid;