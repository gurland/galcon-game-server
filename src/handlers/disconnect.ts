import {Socket} from "../events/base";
import {RoomsManager} from "../entities/rooms_manager";
import {io} from "../app";

export const handleDisconnect = (socket: Socket) => {
  if (socket.data.roomId === undefined || socket.data.user === undefined)
    return;

  const room = RoomsManager.getRoomById(socket.data.roomId);

  if (!room)
    return;

  io.to(room.id.toString()).emit("RoomUserLeave", {user: socket.data.user})
  room.removeUserById(socket.data.user.id);
}
