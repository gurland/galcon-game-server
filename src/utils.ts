import {Socket} from "./events/base";

export function getRandomFloat(leftBound: number, rightBound: number): number {
  return Math.random() * (rightBound - leftBound) + leftBound;
}

export function disconnectSocketWithError(socket: Socket, errorMessage: string): void {
  socket.emit("ErrorEvent", {"message": errorMessage});
  socket.disconnect();
}