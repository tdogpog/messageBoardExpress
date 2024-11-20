const { insertMessage } = require("../db/queries");

function renderNewMsgForm(req, res) {
  res.render("form", {
    title: "New Message",
  });
}

async function postMessage(req, res) {
  if (!req.session.user) {
    return res.render("form", {
      title: "New Message",
      unauthorized: "Please log in to post a message",
    });
  }
  try {
    await insertMessage(req.body.message, req.body.title, req.session.user.id);
    res.redirect("/");
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).send("Error posting message");
  }
}

module.exports = { postMessage, renderNewMsgForm };
