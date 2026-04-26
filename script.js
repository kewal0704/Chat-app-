const socket = io();

// 🔥 fixed username
const username = "Kewal";

function sendMessage() {
  const input = document.getElementById("message");
  const msg = input.value;

  if (msg.trim() === "") return;

  socket.emit("chat message", {
    user: username,
    text: msg
  });

  input.value = "";
}

// 🔥 receive new message
socket.on("chat message", (data) => {
  addMessage(data.user, data.text);
});

// 🔥 load old messages
socket.on("load messages", (messages) => {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = "";

  messages.forEach(msg => {
    addMessage(msg.user, msg.text);
  });
});

// 🔥 message show logic
function addMessage(user, text) {
  const chatBox = document.getElementById("chat-box");

  const div = document.createElement("div");

  // 🔥 agar Kewal hai → right side
  if (user === username) {
    div.classList.add("message", "sent");
  } else {
    div.classList.add("message", "received");
  }

  div.innerText = user + ": " + text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}