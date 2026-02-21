const express = require("express");
const studentController = require("../controllers/studentController");
const { requireStudent } = require("../middleware/auth");

const router = express.Router();

router.get("/jobs", requireStudent, studentController.listJobs);
router.post("/jobs/:jobId/apply", requireStudent, studentController.applyJob);
router.get("/applied", requireStudent, studentController.appliedJobs);

module.exports = router;
