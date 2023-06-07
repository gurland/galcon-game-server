import {Socket} from "../events/base";
import {RoomsManager} from "../entities/rooms_manager";
import {disconnectSocketWithError} from "../utils";
import {routeChatMessage} from "./chat_command_handlers/router";
import {handleDisconnect} from "./disconnect";
import {handleBatchSend} from "./batch_send";
import {handleRoomStateChange} from "./room_state_change";
import {io} from "../app";

export const handleInitialConnect = (socket: Socket) => {
  const roomId = socket.data.roomId;
  const user = socket.data.user;

  if (roomId === undefined || !user)
    return disconnectSocketWithError(socket, `Please provide valid roomId and JWT token!`)

  const room = RoomsManager.getRoomById(roomId);
  if (!room)
    return disconnectSocketWithError(socket, `Room with id ${socket.data.roomId} was not found!`)

  if (room.getUserById(user.id)) {
    return disconnectSocketWithError(socket, `User is already in room with id ${room.id}`)
  }

  else {
    socket.join(roomId.toString())
    room.addUser(user)
    io.to(room.id.toString()).emit("RoomUserJoin", {
      user: user
    });
  }

  socket.on("ChatMessageEvent", event => routeChatMessage(event.text, socket));

  socket.on("RoomStateChangeEvent", event => handleRoomStateChange(event, socket))

  socket.on("BatchSendEvent", (event) => handleBatchSend(event, socket));

  socket.on("disconnecting", () => handleDisconnect(socket));
}
