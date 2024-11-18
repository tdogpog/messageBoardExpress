const express = require("express");
const app = express();
const path = require("node:path");
const messagesRouter = require("./routes/messagesRouter");
//////////////////// AuthImports
const bcrypt = require("bcryptjs");
const pool = require("./db/pool");
const session = require("express-session");

//sess middleware
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//messages router come after sess middleware
app.use("/", messagesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
