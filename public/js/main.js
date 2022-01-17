const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const userList = document.getElementById("users");

// Get username from URL
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Output message to DOM
function outputMessage(message) {
  const messageElm = document.createElement("div");
  messageElm.classList.add("message");
  messageElm.innerHTML = `
  <p class="meta">
    ${message.userName}<span> ${message.time}</span>
  </p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(messageElm);
  messageElm.scrollIntoView();
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

// Join chat
socket.emit("joinChat", { username });

// Get users
socket.on("chatUsers", ({ users }) => {
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  outputMessage(message);
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});


