import express from "express";
import path from "path";
import chatRouter from "./chatRouter.js";
import { EventEmitter } from "events";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const port = process.env.port || 8000;

const app = express();
export const chatEmitter = new EventEmitter();

chatEmitter.on("message", (req, res, message, status = 200) => {
  res.status(status).send(message);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/static", express.static(path.join(__dirname, "/mychat")));

app.use("/", chatRouter);

const start = async () => {
  try {
    app.listen(port, () => {
      console.info(
        `The server has been successfully started on the port: ${port}`
      );
    });
  } catch (err) {
    console.error(err);
  }
};

await start();
