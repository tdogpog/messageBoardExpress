const express = require("express");
const app = express();
const path = require("node:path");
const messagesRouter = require("./routes/messagesRouter");
const authRouter = require("./routes/authRouter");

//////////////////// AuthImports
const session = require("express-session");
const pool = require("./db/pool");
const pgSession = require("connect-pg-simple")(session);
const passport = require("passport");
require("dotenv").config({ path: "./.env" });

//sess middleware first to handle sess data for all routes
app.use(
  session({
    store: new pgSession({
      pool: pool, // The PostgreSQL connection pool
      tableName: "session", // The table name where sessions will be stored
    }),
    secret: process.env.SESSION_SECRET, // A string used to sign the session ID cookie
    resave: false, // Don't force save on every request (good for performance)
    saveUninitialized: false, // Don't save uninitialized sessions (good for privacy)
    cookie: {
      secure: false, // Set to true in production if using HTTPS
      maxAge: 15 * 60 * 1000, // Session expiration time, in milliseconds, this is 15 minutes
    },
  })
);

//passport middleware  comes after sess because it utilizes sess
app.use(passport.session());

//body parsing to handle forms
app.use(express.urlencoded({ extended: true }));

//view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//messages router come after sess middleware

//auth related routes and our homepage
app.use("/", authRouter);

//msg related routes
app.use("/messages", messagesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
