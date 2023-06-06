import {Socket} from "../../events/base";
import {disconnectSocketWithError} from "../../utils";
import {io} from "../../app";

export const startHandler = (text: string, socket: Socket) => {
  const roomId = socket.data.roomId;
  if (!roomId)
    return disconnectSocketWithError(socket, "Sorry, but no room id means no game start :C")

  const roomSockets = io.to(roomId.toString());

  roomSockets.emit("ChatMessageEvent", {
    text: `Server: ${socket.data.user?.username} sent /start command`
  })
}