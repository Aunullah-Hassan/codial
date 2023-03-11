// Since socket.io can be used for multiple purposes Hence we create a seperate chat config
// this will serve as a observer While chat_engine.js will be our font-end i.e Subscriber

// Next Steep--> is to create a connection b/w a user and server i.e the observer and the subscriber,so
// user will now subscribe to observer
// user initiates the connection Always and then observer detects it and acknowledges that conn has been established hence first go to chat_engine.js

module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer, {
        cors: {
          origin: "http://localhost:8000",
          methods: ["GET", "POST"]
        }
      });

    io.sockets.on('connection', function(socket){
        console.log('new connection received to observer', socket.id);

        socket.on('disconnect',function(){
            console.log('socket disconnected ..!');
        });


        socket.on('join_room',function(data){
            console.log('Chat room joining request recieved :', data);

            // below wil make the socket(user) join the chatRoom if it exists otherwise create the chatRoom
            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined',data);

        });

        // CHANGE :: detect send_message and broadcast to everyone in the room
        socket.on('send_message',function(data){

            io.in(data.chatroom).emit('recieve_message',data);
        });

    });


}