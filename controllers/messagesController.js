const { getAllMessages, insertMessage } = require("../db/queries");

async function displayMessages(req, res) {
  try {
    const messages = await getAllMessages();
    res.render("index", { messages });
  } catch (error) {
    res.status(500).send("Error fetching messages");
  }
}

async function postMessage(req, res) {
  const { message, author } = req.body;
  try {
    //dont worry about not writing this or returning this since our
    //redirect will immediately get all messages via sql query in displayMessages
    await insertMessage(message, author);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error posting message");
  }
}

function renderNewMsgForm(req, res) {
  res.render("form", { title: "New Message" });
}

module.exports = { displayMessages, postMessage, renderNewMsgForm };
