const bcrypt = require("bcrypt");
const { addFlash } = require("../middleware/flash");

const showAdminLogin = (req, res) => {
  res.render("auth/admin-login", { title: "Admin Login" });
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminHash) {
      addFlash(req, "error", "Admin credentials are not configured.");
      return res.redirect("/admin/login");
    }

    if (!email || !password) {
      addFlash(req, "error", "Email and password are required.");
      return res.redirect("/admin/login");
    }

    if (email !== adminEmail) {
      addFlash(req, "error", "Invalid credentials.");
      return res.redirect("/admin/login");
    }

    const match = await bcrypt.compare(password, adminHash);
    if (!match) {
      addFlash(req, "error", "Invalid credentials.");
      return res.redirect("/admin/login");
    }

    req.session.admin = {
      email: adminEmail
    };

    addFlash(req, "success", "Welcome, admin.");
    return res.redirect("/admin/dashboard");
  } catch (err) {
    return next(err);
  }
};

const adminLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  showAdminLogin,
  adminLogin,
  adminLogout
};
