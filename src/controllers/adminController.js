const { allAsync, getAsync, runAsync } = require("../config/db");
const { addFlash } = require("../middleware/flash");

const dashboard = async (req, res, next) => {
  try {
    const students = await getAsync("SELECT COUNT(*) AS total FROM students");
    const jobs = await getAsync("SELECT COUNT(*) AS total FROM jobs");
    const applications = await getAsync("SELECT COUNT(*) AS total FROM applications");

    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      totals: {
        students: students.total,
        jobs: jobs.total,
        applications: applications.total
      }
    });
  } catch (err) {
    next(err);
  }
};

const listJobs = async (req, res, next) => {
  try {
    const rows = await allAsync(
      "SELECT id, title, company, location, salary, created_at FROM jobs ORDER BY created_at DESC"
    );

    res.render("admin/jobs", { title: "Manage Jobs", jobs: rows });
  } catch (err) {
    next(err);
  }
};

const showAddJob = (req, res) => {
  res.render("admin/add-job", { title: "Add Job" });
};

const addJob = async (req, res, next) => {
  try {
    const { title, company, location, salary, description } = req.body;
    if (!title || !company || !location || !description) {
      addFlash(req, "error", "Please fill in all required fields.");
      return res.redirect("/admin/jobs/new");
    }

    await runAsync(
      "INSERT INTO jobs (title, company, location, salary, description) VALUES (?, ?, ?, ?, ?)",
      [title, company, location, salary || null, description]
    );

    addFlash(req, "success", "Job posted.");
    return res.redirect("/admin/jobs");
  } catch (err) {
    return next(err);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const jobId = Number(req.params.jobId);
    await runAsync("DELETE FROM jobs WHERE id = ?", [jobId]);
    addFlash(req, "success", "Job deleted.");
    return res.redirect("/admin/jobs");
  } catch (err) {
    return next(err);
  }
};

const viewApplicants = async (req, res, next) => {
  try {
    const jobId = Number(req.params.jobId);
    const job = await getAsync("SELECT id, title, company FROM jobs WHERE id = ?", [
      jobId
    ]);

    if (!job) {
      addFlash(req, "error", "Job not found.");
      return res.redirect("/admin/jobs");
    }

    const rows = await allAsync(
      `SELECT a.id, a.status, a.applied_at, s.name, s.email 
       FROM applications a 
       INNER JOIN students s ON s.id = a.student_id 
       WHERE a.job_id = ? 
       ORDER BY a.applied_at DESC`,
      [jobId]
    );

    res.render("admin/applicants", {
      title: "Applicants",
      applicants: rows,
      job
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  dashboard,
  listJobs,
  showAddJob,
  addJob,
  deleteJob,
  viewApplicants
};
