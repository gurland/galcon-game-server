import {Socket} from "../../events/base";
import {disconnectSocketWithError} from "../../utils";
import {io} from "../../app";

export const defaultHandler = (text: string, socket: Socket) => {
  const roomId = socket.data.roomId;
  if (!roomId)
    return disconnectSocketWithError(socket, "Sorry, but no room id means no chat :C")

  const ioRoom = io.to(roomId.toString());

  ioRoom.emit("ChatMessageEvent", {
    text: text
  })
}