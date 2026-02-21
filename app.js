require("dotenv").config();

const path = require("path");
const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const morgan = require("morgan");

const { sessionOptions } = require("./src/config/db");
const { exposeFlash } = require("./src/middleware/flash");

const authRoutes = require("./src/routes/authRoutes");
const studentRoutes = require("./src/routes/studentRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "src", "public")));

const sessionStore = new FileStore({
  path: "./sessions",
  ttl: 28800
});
app.use(
  session({
    ...sessionOptions,
    store: sessionStore
  })
);

app.use(exposeFlash);

app.get("/", (req, res) => {
  res.render("partials/home", { title: "Student Placement Management System" });
});

app.use("/auth", authRoutes);
app.use("/student", studentRoutes);
app.use("/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).render("errors/404", { title: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("errors/500", { title: "Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
