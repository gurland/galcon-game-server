import {RoomState, Socket} from "../events/base";
import {io} from "../index";
import {RoomStateChangeEvent} from "../events/client_to_server";
import {RoomsManager} from "../entities/rooms_manager";
import {disconnectSocketWithError} from "../utils";
import {handleStartGame} from "./internal_handlers/start_game";

export const handleRoomStateChange = (event: RoomStateChangeEvent, socket: Socket) => {
  const roomId = socket.data.roomId!;
  const room = RoomsManager.getRoomById(roomId);

  if (room!.state != RoomState.Init || event.state != RoomState.Start)
    return disconnectSocketWithError(socket, `Bad state. Game has state: ${room!.state}`);
  if (room!.users.length < 2)
    return socket.emit("ErrorEvent", {message: "Cannot start the game with less than 2 players!"});

  room!.state = RoomState.Start;
  io.to(roomId.toString()).emit("RoomStateChangeEvent", {
    state: RoomState.Start
  });

  handleStartGame({
    date: new Date(),
    roomId: roomId
  })
}