const path = require('path');
const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getAllUsers} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'my-chat bot';

io.on('connection', socket => {
    socket.on('joinChat', ({username}) => {
        const user = userJoin(socket.id, username);
        socket.join(user.username);

        //New user
        socket.emit('message',formatMessage(botName,'Welcome to My-Chat'));

        //Message for all users, except the one that connects
        socket.broadcast
        .emit('message',formatMessage(botName,`${user.username} has joined the chat`));
        
        //Listen for chat message
        socket.on('chatMessage', msg => {
            const user = getCurrentUser(socket.id);
            io.emit('message',formatMessage(user.username, msg)); 
        });

        //Disconnects
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);

            if(user){
                io.emit('message', formatMessage(botName,`${user.username} has left the chat`));
                io.emit('chatUsers', {
                    users: getAllUsers()
                });
            }
        });

        //Send users info
        io.emit('chatUsers', {
            users: getAllUsers()
        });
    });
});



const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));