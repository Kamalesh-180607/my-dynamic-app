const requireStudent = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  return next();
};

const requireAdmin = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  return next();
};

module.exports = {
  requireStudent,
  requireAdmin
};
