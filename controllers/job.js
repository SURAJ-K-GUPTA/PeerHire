const Job  = require("../model/Job");
const zod = require("zod");

const jobSchema = zod.object({
    title: zod.string(),
    description: zod.string(),
    budget: zod.number(),
    duration: zod.number(),
    skillsRequired: zod.array(zod.string()),
})


const createJobController = async (req, res) => {
    try {
        const result = jobSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ message: "Invalid request body", error: result.error.message });
        }
        const { title, description, budget, duration, skillsRequired } = result.data;
        const job = await Job.create({ title, description, budget, duration, skillsRequired, postedBy: req.user.id });
        await job.save();
        res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        return res.status(500).json({ message: "Invalid request", error: error.message });
    }
}


const getAllJobsController = async (req, res) => {
    try {
        const {skills} = req.query;
        let jobs = [];
        if(skills){
        const skillsArray = skills.split(",").map((skill) => skill.trim().toLowerCase());
        jobs = await Job.find({
            skillsRequired: { $in: skillsArray },
        }).populate("postedBy", "-password");

    }else{
        jobs = await Job.find().populate("postedBy", "-password");
    }

        res.status(200).json({ jobs });
    } catch (error) {
        return res.status(500).json({ message: "Invalid request", error: error.message });  
    }
}

const getJobByIdController = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId).populate("postedBy", "-password");
        if (!job) {
            return res.status(404).json({ message: "Job not found", error: "Job not found" });
        }
        res.status(200).json({ job });
        } catch (error) {
            return res.status(500).json({ message: "Invalid request", error: error.message });
        }
}
module.exports = { createJobController, getAllJobsController, getJobByIdController };

