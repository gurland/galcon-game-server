import {Socket} from "../events/base";
import {RoomsManager} from "../entities/rooms_manager";
import {io} from "../index";
import {disconnectSocketWithError} from "../utils";
import {RoomState} from "../events/base";
import {BatchSendEvent} from "../events/client_to_server";

export const handleBatchSend = (event: BatchSendEvent, socket: Socket) => {
  const room = RoomsManager.getRoomById(socket.data.roomId!);
  if (!room)
    return disconnectSocketWithError(socket, "Room does not exist!");

  if (room.state != RoomState.Start)
    return disconnectSocketWithError(socket, "This room haven't started game yet!");



  io.to(room!.id.toString()).emit("RoomUserLeave", {user: socket.data.user!})
  room!.removeUserById(socket.data.user!.id);
}
