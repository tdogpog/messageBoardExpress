const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];

const { Router } = require("express");
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  res.render("index", { title: "Mini Messageboard", messages: messages });
});

indexRouter.post("/new", (req, res) => {
  //the body of the req is an obj containing user/text
  // the fields are named according to the name='' field on input
  const { user, text } = req.body;
  messages.push({ text, user, added: new Date() });
  res.redirect("/");
});

module.exports = indexRouter;
