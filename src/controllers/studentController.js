const { allAsync, getAsync, runAsync } = require("../config/db");
const { addFlash } = require("../middleware/flash");

const listJobs = async (req, res, next) => {
  try {
    const studentId = req.session.user.id;
    const rows = await allAsync(
      `SELECT j.id, j.title, j.company, j.location, j.salary, j.description, j.created_at, 
       a.id AS application_id 
       FROM jobs j 
       LEFT JOIN applications a ON a.job_id = j.id AND a.student_id = ? 
       ORDER BY j.created_at DESC`,
      [studentId]
    );

    res.render("student/jobs", { title: "Available Jobs", jobs: rows });
  } catch (err) {
    next(err);
  }
};

const applyJob = async (req, res, next) => {
  try {
    const studentId = req.session.user.id;
    const jobId = Number(req.params.jobId);

    const existing = await getAsync(
      "SELECT id FROM applications WHERE student_id = ? AND job_id = ?",
      [studentId, jobId]
    );
    if (existing) {
      addFlash(req, "info", "You already applied for this job.");
      return res.redirect("/student/jobs");
    }

    await runAsync("INSERT INTO applications (student_id, job_id) VALUES (?, ?)", [
      studentId,
      jobId
    ]);

    addFlash(req, "success", "Application submitted.");
    return res.redirect("/student/applied");
  } catch (err) {
    return next(err);
  }
};

const appliedJobs = async (req, res, next) => {
  try {
    const studentId = req.session.user.id;
    const rows = await allAsync(
      `SELECT a.id, a.status, a.applied_at, j.title, j.company, j.location 
       FROM applications a 
       INNER JOIN jobs j ON j.id = a.job_id 
       WHERE a.student_id = ? 
       ORDER BY a.applied_at DESC`,
      [studentId]
    );

    res.render("student/applied", { title: "Applied Jobs", applications: rows });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  listJobs,
  applyJob,
  appliedJobs
};
