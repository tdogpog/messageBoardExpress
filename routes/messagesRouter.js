const { Router } = require("express");

const {
  displayMessages,
  postMessage,
  renderNewMsgForm,
} = require("../controllers/messagesController");

const messagesRouter = Router();

//routing
messagesRouter.get("/", displayMessages);
messagesRouter.get("/new", renderNewMsgForm);
messagesRouter.post("/new", postMessage);

module.exports = messagesRouter;
