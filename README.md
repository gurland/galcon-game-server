## Introduction

Galcon Game Server works above two protocols.


## RESTful API

This is used to manage stateless information:
- Users - register and authenticate Users using JWT
- Rooms - create and retrieve Rooms with settings, planet map, chat messages and more.


Documentation is available at [Swagger](https://app.swaggerhub.com/apis-docs/perfect/galcon-server/0.0.1)

Or local and interactive version: `npm run dev` -> go to `http://localhost:8000/api/docs`


## Socket.IO

This is used to communicate various real-time events between Users and the Server.


### How to work with it

1. Install `socket.io`
2. Obtain JWT token through authorizing the User using RESTful API
3. Get desired Room id for User to join
4. Initialize socket object passing both your JWT token and roomId as shown below: 
    ```javascript
    import { io } from "socket.io-client";
    
    const socket = io("http://localhost:8000/", {
      auth: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTY4MzcyNTk1OH0.5hLxvGL324wuNzilDF9I3K-ft0CKgvTrw4dFCJpjD1Q"
      },
      query: {
        roomId: 0
      }
    });
    ```
5. Set desired event listeners (events from `client_to_server.ts`): 
   ```javascript
   socket.on("ChatMessageEvent", (event) => {
      console.log("New chat message | " + event.text);
    })
   
   socket.on("connect_error", (event) => {
      console.log("Connection error catched: ", event);
    });
    
    socket.on("ErrorEvent", (event) => {
      console.log("Logical error catched: ", event);
    });
   // ...
   ```
6. Emit events on user actions (events from `server_to_client.ts`): 
    ```javascript
    const input = document.getElementById('chat-message-input');
    const button = document.getElementById('chat-message-btn');
    
    button.addEventListener('click', () => socket.emit("ChatMessageEvent", {
      "text": input.value
    }));
    ```

This real-time socket.io communication enables clients to:
- Game start/end
- Unit movement
- Planet capture
- And much more.

Check full [game protocol documentation](https://gurland.github.io/galcon-game-server/).
