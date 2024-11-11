const { Router } = require("express");

const {
  displayMessages,
  postMessage,
  renderNewMsgForm,
} = require("../controllers/messagesController");

const messagesrouter = Router();

messagesrouter.get("/", displayMessages);

messagesrouter.get("/new", renderNewMsgForm);

messagesrouter.post("/new", postMessage);

module.exports = messagesrouter;
