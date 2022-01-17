const socket = io();

const chatForm = document.getElementById("chat-form");
const userList = document.getElementById("users");


// Get username from URL
const url = new URLSearchParams(location.search);
const username = url.get('username');
 
/*
*	Functions
*/
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
    </p>
  `;
  document.querySelector(".chat-messages").appendChild(messageElm);
  messageElm.scrollIntoView();
}

// Add users to DOM
function outputUsers({ users }) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

function messageSubmit(e) {
  e.preventDefault();

  // Get message text
  const msgElement = e.target.elements.msg;

  // Emit message to server
  socket.emit("chatMessage", msgElement.value);

  // Clear input
  msgElement.value = "";
  msgElement.focus();
}

/*
*	Event listeners
*/
// Join chat
socket.emit("joinChat", { username });

// Get users
socket.on("chatUsers", outputUsers);

// Message from server
socket.on("message", outputMessage);

// Message submit
chatForm.addEventListener("submit", messageSubmit);


