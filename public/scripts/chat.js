import requestHandler from "./ResponseHandler.js";

const handleServerRequests = async (e) => {
  e.preventDefault();

  switch (window.location.pathname) {
    case "/":
      await requestHandler.handleDefaultMessage();
      break;
    case "/chat":
      await requestHandler.handleMessageEmit();
      break;
    case "/echo":
      await requestHandler.handleEchoMessage();
      break;
    case "/json":
      await requestHandler.handleJSON();
      break;
    case "/sse":
      requestHandler.createMyMessage();
      break;
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname === "/sse") await requestHandler.handleSSE();

  document
    .getElementById("send-message-button")
    .addEventListener("click", handleServerRequests);
});
