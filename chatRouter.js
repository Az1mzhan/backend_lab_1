import chatController from "./ChatController.js";
import { Router } from "express";

const chatRouter = new Router();

chatRouter.route("/*").get(chatController.getChatPage);

chatRouter.route("/").post(chatController.sendDefaultMessage);

chatRouter.route("/echo").post(chatController.sendEchoMessage);

chatRouter.route("/json").post(chatController.sendJSON);

chatRouter.route("/chat").post(chatController.emitMessage);

chatRouter.route("/sse").post(chatController.emitSSE);

export default chatRouter;
