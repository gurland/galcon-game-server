import {Socket} from "../events/base";
import {RoomsManager} from "../entities/rooms_manager";
import {disconnectSocketWithError} from "../utils";
import {routeChatMessage} from "./chat_command_handlers/router";
import {handleDisconnect} from "./disconnect";
import {handleBatchSend} from "./batch_send";
import {handleRoomStateChange} from "./room_state_change";

export const handleInitialConnect = (socket: Socket) => {
  const room = RoomsManager.getRoomById(socket.data.roomId!);
  if (!room)
    return disconnectSocketWithError(socket, `Room with id ${socket.data.roomId} was not found!`)

  if (room.getUserById(socket.data.user!.id)) {
    return disconnectSocketWithError(socket, `User is already in room with id ${room.id}`)
  }

  else {
    socket.join(socket.data.roomId!.toString())
    room.addUser(socket.data.user!)
    room.users.forEach(user => socket.emit("RoomUserJoin", {
      user: socket.data.user!
    }))
  }

  socket.on("ChatMessageEvent", event => routeChatMessage(event.text, socket));

  socket.on("RoomStateChangeEvent", event => handleRoomStateChange(event, socket))

  socket.on("BatchSendEvent", (event) => handleBatchSend(event, socket));

  socket.on("disconnecting", () => handleDisconnect(socket));
}
