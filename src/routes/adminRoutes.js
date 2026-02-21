const express = require("express");
const adminController = require("../controllers/adminController");
const adminAuthController = require("../controllers/adminAuthController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/login", adminAuthController.showAdminLogin);
router.post("/login", adminAuthController.adminLogin);
router.post("/logout", adminAuthController.adminLogout);

router.get("/dashboard", requireAdmin, adminController.dashboard);
router.get("/jobs", requireAdmin, adminController.listJobs);
router.get("/jobs/new", requireAdmin, adminController.showAddJob);
router.post("/jobs", requireAdmin, adminController.addJob);
router.post("/jobs/:jobId/delete", requireAdmin, adminController.deleteJob);
router.get("/jobs/:jobId/applicants", requireAdmin, adminController.viewApplicants);

module.exports = router;
