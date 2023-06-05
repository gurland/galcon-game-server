import {RoomState, Socket} from "../events/base";
import {io} from "../index";
import {RoomStateChangeEvent} from "../events/client_to_server";
import {RoomsManager} from "../entities/rooms_manager";
import {disconnectSocketWithError} from "../utils";

export const handleRoomStateChange = (event: RoomStateChangeEvent, socket: Socket) => {
  const roomId = socket.data.roomId!;
  const room = RoomsManager.getRoomById(roomId);

  if (room!.state != RoomState.Init || event.state != RoomState.Start)
    return disconnectSocketWithError(socket, `Bad state. Game has state: ${room!.state}`);

  room!.state = RoomState.Start;
  io.to(roomId.toString()).emit("RoomStateChangeEvent", {
    state: RoomState.Start
  });

  io.serverSideEmit("StartGameEvent", {
    date: new Date(),
    roomId: roomId
  });
}