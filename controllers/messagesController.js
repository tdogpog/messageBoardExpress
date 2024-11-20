const { getAllMessages, insertMessage } = require("../db/queries");

async function displayMessages(req, res) {
  try {
    const messages = await getAllMessages();

    //check if the user is a member
    const isMember =
      req.session.user && req.session.user.membership === "member";

    //conditional return to the const
    // what will be sent to the render response
    const messagesToRender = messages.map((message) => {
      if (isMember) {
        //contains messages.title, messages.message AS content,
        //messages.timestamp,
        //users.username
        return message;
      }

      return {
        title: message.title,
        content: message.content,
        timestamp: message.timestamp,
      };
    });

    res.render("index", { title: "Message Board", messages: messagesToRender });
  } catch (error) {
    res.status(500).send("Error fetching messages");
  }
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

function renderNewMsgForm(req, res) {
  res.render("form", {
    title: "New Message",
  });
}

module.exports = { displayMessages, postMessage, renderNewMsgForm };
