const { Router } = require("express");

const {
  displayMessages,
  postMessage,
  renderNewMsgForm,
} = require("../controllers/messagesController");

const messagesRouter = Router();

//routing
messagesRouter.get("/", displayMessages);
messagesRouter.get("/log-out", userLogout);
messagesRouter.get("/new", renderNewMsgForm);
messagesRouter.post("/log-in", userLogin);
messagesRouter.post("/sign-up", userSignUp);
messagesRouter.post("/new", postMessage);

module.exports = messagesRouter;
