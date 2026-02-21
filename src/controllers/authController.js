const bcrypt = require("bcrypt");
const { getAsync, runAsync } = require("../config/db");
const { addFlash } = require("../middleware/flash");

const showRegister = (req, res) => {
  res.render("auth/register", { title: "Student Register" });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    if (!name || !email || !password) {
      addFlash(req, "error", "All fields are required.");
      return res.redirect("/auth/register");
    }
    if (password !== confirmPassword) {
      addFlash(req, "error", "Passwords do not match.");
      return res.redirect("/auth/register");
    }

    const existing = await getAsync("SELECT id FROM students WHERE email = ?", [email]);
    if (existing) {
      addFlash(req, "error", "Email already registered.");
      return res.redirect("/auth/register");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await runAsync(
      "INSERT INTO students (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    addFlash(req, "success", "Registration successful. Please log in.");
    return res.redirect("/auth/login");
  } catch (err) {
    return next(err);
  }
};

const showLogin = (req, res) => {
  res.render("auth/login", { title: "Student Login" });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      addFlash(req, "error", "Email and password are required.");
      return res.redirect("/auth/login");
    }

    const student = await getAsync(
      "SELECT id, name, email, password_hash FROM students WHERE email = ?",
      [email]
    );
    if (!student) {
      addFlash(req, "error", "Invalid credentials.");
      return res.redirect("/auth/login");
    }

    const match = await bcrypt.compare(password, student.password_hash);
    if (!match) {
      addFlash(req, "error", "Invalid credentials.");
      return res.redirect("/auth/login");
    }

    req.session.user = {
      id: student.id,
      name: student.name,
      email: student.email
    };

    addFlash(req, "success", "Welcome back.");
    return res.redirect("/student/jobs");
  } catch (err) {
    return next(err);
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = {
  showRegister,
  register,
  showLogin,
  login,
  logout
};
