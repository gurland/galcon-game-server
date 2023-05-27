import {Socket} from "../events/base";
import {RoomsManager} from "../entities/rooms_manager";
import {io} from "../index";

export const handleDisconnect = (socket: Socket) => {
  const room = RoomsManager.getRoomById(socket.data.roomId!);
  io.to(room!.id.toString()).emit("RoomUserLeave", {user: socket.data.user!})
  room!.removeUserById(socket.data.user!.id);
}
