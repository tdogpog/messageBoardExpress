const { insertMessage } = require("../db/queries");

function renderNewMsgForm(req, res) {
  res.render("form", {
    title: "New Message",
    unauthorized: "",
  });
}

async function postMessage(req, res) {
  console.log("req info given to the post", req.user);
  if (!req.user) {
    return res.render("form", {
      title: "New Message",
      unauthorized: "Please log in to post a message",
    });
  }
  try {
    await insertMessage(req.body.message, req.body.title, req.user.id);
    res.redirect("/");
  } catch (error) {
    console.log("Error posting,", error.message);
    res.status(500).send("Error posting message");
  }
}

module.exports = { postMessage, renderNewMsgForm };
