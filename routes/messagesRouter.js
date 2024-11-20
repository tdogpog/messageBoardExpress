const { Router } = require("express");

const {
  postMessage,
  renderNewMsgForm,
} = require("../controllers/messagesController");

const messagesRouter = Router();

//routing

messagesRouter.get("/new", renderNewMsgForm);
messagesRouter.post("/new", postMessage);

module.exports = messagesRouter;
