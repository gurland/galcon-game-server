import {Socket} from "../events/base";
import {RoomsManager} from "../entities/rooms_manager";
import {io} from "../index";
import {disconnectSocketWithError} from "../utils";
import {RoomState} from "../events/base";
import {BatchSendEvent} from "../events/client_to_server";

export const handleBatchSend = (event: BatchSendEvent, socket: Socket) => {
  if (!socket.data.roomId || !socket.data.user)
    return disconnectSocketWithError(socket, "Please, provide valid roomId and JWT token!");

  const room = RoomsManager.getRoomById(socket.data.roomId);
  if (!room)
    return disconnectSocketWithError(socket, "Room does not exist!");

  if (room.state != RoomState.Start)
    return disconnectSocketWithError(socket, "This room haven't started game yet!");


  try {
    const newBatch = room.addBatch(socket.data.user, event);
    newBatch.fromPlanet.units -= newBatch.count;

    io.to(room.id.toString()).emit("BatchSendEvent", {
      id: newBatch.id,
      ownerId: newBatch.owner.id,

      fromPlanetId: newBatch.fromPlanet.id,
      toPlanetId: newBatch.toPlanet.id,

      fromX: newBatch.fromPoint.x,
      fromY: newBatch.fromPoint.y,
      toX: newBatch.toPoint.x,
      toY: newBatch.toPoint.y,
      currentX: newBatch.currentPoint.x,
      currentY: newBatch.currentPoint.y,

      newFromPlanetUnits: newBatch.fromPlanet.units,
      count: newBatch.count
    })
  }
  catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error ocurred";

    socket.emit("ErrorEvent", {
      message: message
    })
    return
  }
}
