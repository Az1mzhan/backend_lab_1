import fs from "fs";
import path from "path";
import { __dirname, chatEmitter } from "./app.js";

class ChatController {
  getChatPage(req, res) {
    try {
      res.status(200).sendFile(path.join(__dirname, "public/chat.html"));
    } catch (err) {
      console.error(err);

      const message = { message: "The chat page hasn't been loaded properly" };
      chatEmitter.emit("message", req, res, message, 400);
    }
  }

  sendDefaultMessage(req, res) {
    try {
      const message = { message: "hi" };

      chatEmitter.emit("message", req, res, message);
    } catch (err) {
      console.error(err);

      const message = { message: "Message hasn't been sent successfully" };
      chatEmitter.emit("message", req, res, message, 400);
    }
  }

  sendEchoMessage(req, res) {
    try {
      const { message } = req.body;
      const messageObject = {
        normal: message,
        shouty: message.toUpperCase(),
        charCount: message.length,
        backwards: message.split("").reverse().join(""),
      };

      chatEmitter.emit("message", req, res, { message: messageObject });
    } catch (err) {
      console.error(err);

      const message = { message: "Message hasn't been sent successfully" };
      chatEmitter.emit("message", req, res, message, 400);
    }
  }

  sendJSON(req, res) {
    try {
      const message = {
        message: JSON.parse(fs.readFileSync("./json/db.json", "utf8")),
      };

      chatEmitter.emit("message", req, res, message);
    } catch (err) {
      console.error(err);
      res.status(400).send({ message: "JSON file hasn't been read properly" });
    }
  }

  emitMessage(req, res) {
    try {
      const { message } = req.query;
      const messageObject = {
        message: message,
      };

      chatEmitter.emit("message", req, res, messageObject);
    } catch (err) {
      console.error(err);

      const message = "The message event emitter hasn't been handled properly";
      chatEmitter.emit("message", req, res, message);
    }
  }

  emitSSE(req, res) {
    try {
      // prettier-ignore
      res.writeHead(200, {
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      });

      const messages = JSON.parse(
        fs.readFileSync("./json/messages.json", "utf8")
      ).messages;
      let eventString;
      let i = 0;

      const timer = setInterval(() => {
        const message = messages[i];
        eventString = message.message;

        res.status(200).write(eventString);
        ++i;

        if (i === messages.length) {
          eventString = "Anyway, got to get back to work. Talk to you later!";
          console.log(eventString);

          res.status(200).write(eventString);
          clearInterval(timer);
          res.end();
        }
      }, 5000);
    } catch (err) {
      console.error(err);

      const message = {
        message: "The SSE hasn't been handled properly",
      };
      chatEmitter.emit("message", req, res, message);
    }
  }
}

export default new ChatController();
