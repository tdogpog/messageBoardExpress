const express = require("express");
const app = express();
const path = require("node:path");
const newRouter = require("./routes/new");
const indexRouter = require("./routes/index");

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//indexRouter can handle anything under it because i've registered it to handle
//anything that starts with /... which is everything.
app.use("/", indexRouter);
app.use("/new", newRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});
