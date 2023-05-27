import {Socket} from "../../events/base";
import {io} from "../../index";

export const defaultHandler = (text: string, socket: Socket) => {
  const ioRoom = io.to(socket.data.roomId!.toString());

  ioRoom.emit("ChatMessageEvent", {
    text: text
  })
}