import {Socket} from "./events/base";


export const handleInitialConnection = (socket: Socket) => {
  const roomId = socket.data.roomId || 0;
  socket.join(roomId.toString());
  socket.emit("RoomUserJoin", {user: socket.data.user!})
}
