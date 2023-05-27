import {Socket} from "../../events/base";
import {io} from "../../index";

export const startHandler = (text: string, socket: Socket) => {
  const ioRoom = io.to(socket.data.roomId!.toString());

  ioRoom.emit("ChatMessageEvent", {
    text: `Server: ${socket.data.user?.username} sent /start command`
  })
}