import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;

    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

  let htmlFullName = "";

  if (data.userId === myId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  div.innerHTML = `
    ${htmlFullName}
    <div class="inner-content">${data.content}</div>
  `;

  body.insertBefore(div, boxTyping);

  // scroll message to bottom
  body.scrollTop = body.scrollHeight;
});

// Scroll chat to bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}

// emoji picker
// show popup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);

  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}

// insert icon into input
let timeout;
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  // input chat
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );

  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;

    // insert icon into chat input
    inputChat.value = inputChat.value + icon;

    // typing...
    socket.emit("CLIENT_SEND_TYPING", "show");
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
  });

  // typing...
  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeout);

    timeout = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
  });
}

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");

if (elementListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type === "show") {
      const existTyping = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );

      if (!existTyping) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);

        boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

        elementListTyping.appendChild(boxTyping);

        const body = document.querySelector(".chat .inner-body");
        body.scrollTop = body.scrollHeight;
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );

      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  });
}
