import axios from "https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm";

class ResponseHandler {
  createMyMessage() {
    const messageInput = document.getElementById("message-input");

    if (messageInput.value === "") return;

    const messageBox = document.createElement("div");

    messageBox.className = "message my-message";

    messageBox.textContent = messageInput.value;

    const messageContainer = document.getElementById("message-container");
    messageContainer.appendChild(messageBox);
  }

  createBotMessage(message) {
    if (typeof message !== "string" || message === "") return;

    const messageBox = document.createElement("div");

    messageBox.className = "message bot-message";

    messageBox.textContent = message;

    const messageContainer = document.getElementById("message-container");
    messageContainer.appendChild(messageBox);
  }

  async handleDefaultMessage() {
    try {
      const response = await axios.post("/");
      const message = response.data.message;

      this.createMyMessage();
      this.createBotMessage(message);
    } catch (err) {
      console.error(err);
    }
  }

  async handleEchoMessage() {
    try {
      const messageInput = document.getElementById("message-input");
      const input = messageInput.value;

      const response = await axios.post("/echo", {
        message: input,
      });
      const message = response.data.message;

      let formattedMessage = "";

      for (const format in message)
        formattedMessage += `${format}: ${message[format]} \r\n`;

      this.createMyMessage();
      this.createBotMessage(formattedMessage);
    } catch (err) {
      console.error(err);
    }
  }

  async handleJSON() {
    try {
      const response = await axios.post("/json");
      const message = response.data.message;

      let jsonFormattedMessage = "";

      for (const format in message)
        jsonFormattedMessage += `${format}: ${message[format]} \r\n`;

      this.createMyMessage();
      this.createBotMessage(jsonFormattedMessage);
    } catch (err) {
      console.error(err);
    }
  }

  async handleMessageEmit() {
    try {
      const urlSearchParams = new URLSearchParams(window.location.search);

      const response = await axios.post(`/chat?${urlSearchParams}`);
      console.log(response);
      const message = response.data.message;

      this.createMyMessage();
      this.createBotMessage(message);
    } catch (err) {
      console.error(err);
    }
  }

  async handleSSE() {
    fetch("/sse", {
      method: "POST",
    })
      .then((response) => {
        const stream = response.body;
        const reader = stream.getReader();

        const readChunk = () => {
          reader
            .read()
            .then(({ value, done }) => {
              if (done) {
                console.info("Stream finished");
                return;
              }
              const chunkString = new TextDecoder().decode(value);

              this.createBotMessage(chunkString);

              readChunk();
            })
            .catch((error) => {
              // Log the error
              console.error(error);
            });
        };
        // Start reading the first chunk
        readChunk();
      })
      .catch((error) => {
        // Log the error
        console.error(error);
      });
  }
}

export default new ResponseHandler();
