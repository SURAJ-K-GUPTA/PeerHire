const zod = require("zod");
const Job = require("../model/Job");
const Bid = require("../model/Bid");
const bidSchema = zod.object({
  bidAmount: zod.number(),
  timeline: zod.number(),
  message: zod.string(),
});

const bidPlaceController = async (req, res) => {
  try {
    const result = bidSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request body", error: result.error });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", error: "Job not found" });
    }


    if (req.user.role !== "freelancer") {
        return res.status(403).json({ message: "Unauthorized", error: "Only freelancers can place bids" });
    }

    const { bidAmount, timeline, message } = result.data;

    const bid = await Bid.create({
      job: job._id,
      freelancer: req.user.id,
      bidAmount,
      timeline,
      message,
      status: "Pending",
    });
    await bid.save();
    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (error) {
    return res.status(500).json({ message: "Invalid request", error });
  }
};

const getBidsController = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", error: "Job not found" });
    }
    if(job.postedBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized", error: "Only the job poster can view bids" });
    }
    
    const bids = await Bid.find({ job: jobId }).populate("freelancer", "-password").populate("job");
    res.status(200).json({ bids });
  } catch (error) {
    return res.status(500).json({ message: "Invalid request", error: error.message });
  }
};

const bidStatusController = async (req, res) => {
  try {
    const { status, bidId } = req.params;
    const bid = await Bid.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: "Bid not found", error: "Bid not found" });
    }
    if (status === "accept") {
      const updatedBid = await Bid.findByIdAndUpdate(bidId, { status: "Accepted" }, { new: true });
      return res.status(200).json({ message: "Bid Accepted Successfully", bid: updatedBid });
    }
    if (status === "reject") {
      const updatedBid = await Bid.findByIdAndUpdate(bidId, { status: "Rejected" }, { new: true });
      return res.status(200).json({ message: "Bid Rejected Successfully", bid: updatedBid });
    }
    res.status(200).json({ message: "Invalid status", error: "Invalid status" });
  } catch (error) {
    return res.status(500).json({ message: "Invalid request", error });
  }
};

module.exports = { bidPlaceController, getBidsController, bidStatusController };
