class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://localhost:5000');

        if(this.userEmail){
            this.connectionHandler();
        }


    }

    connectionHandler(){
        let self = this;

        this.socket.on('connect',function(){
            console.log('connection established using sockets');

            // sending request for chatroom name codial via join_room as event name
            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom: 'codial'

            });

            self.socket.on('user_joined',function(data){
                console.log('a user joined !!', data);
            });

            $('#send-message').click(function(e){
                    
                let msg = $('#chat-message-input').val();

                if(msg != ''){
                    self.socket.emit('send_message',{
                        user_email: self.userEmail,
                        message: msg,
                        chatroom: 'codial'
                    });

                }  

            });

            self.socket.on('recieve_message',function(data){
                console.log('message received', data.message);

                let msgtype = 'other-message';

                if(data.user_email == self.userEmail){
                    msgtype = 'self-message'
                }

                let newMessage = $('<li>');
                newMessage.append($('<span>',{
                    'html': data.message
                }));

                newMessage.append($('<p>')).append($('<sub>',{
                    'html': data.user_email
                }));

                newMessage.addClass(msgtype);

                $('#chat-messages-list').append(newMessage);

            });

        });
    }

}

// Now we need to create and join chatRoom where a user will send request to join chatRoom and observer will    then emit notification to all users with data about who joined the chatRoom including himself.
// BUT AGAIN THE QUESTION IS WHAT IS CHAT ROOM ?
// IMAGINE there is an array of emails or Ids of users where all these users are chatting together.so one chat room can be connected with multiple sockets(users) and one socket can establish connection with multiple chatRooms