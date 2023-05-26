import {Socket} from "./events/base";
import {RoomsManager} from "./entities/rooms_manager";
import {disconnectSocketWithError} from "./utils";


export const handleInitialConnection = (socket: Socket) => {
  const room = RoomsManager.getRoomById(socket.data.roomId!);
  if (!room)
    return disconnectSocketWithError(socket, `Room with id ${socket.data.roomId} was not found!`)

  console.log(room.getUserById(socket.data.user!.id));

  if (room.getUserById(socket.data.user!.id)) {
    return disconnectSocketWithError(socket, `User is already in room with id ${room.id}`)
  }

  else {
    socket.join(socket.data.roomId!.toString())
    room.addUser(socket.data.user!)
    room.users.forEach(user => socket.emit("RoomUserJoin", {user}))
  }
}
