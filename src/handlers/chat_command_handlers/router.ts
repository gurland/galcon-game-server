import {Socket} from "../../events/base";
import {startHandler} from "./start";
import {defaultHandler} from "./default";


type handlerFunction = (message: string, socket: Socket) => void;
interface RoutingTable {
  [id: string]: handlerFunction
}

const routingTable: RoutingTable = {
  "/start": startHandler
}

export const routeChatMessage = (message: string, socket: Socket) => {
  console.log(`Got new message in Room with ID: ${socket.data.roomId} | 
               from User: ${socket.data.user} | 
               Text: ${message}`)

  const command = message.split(" ")[0];

  if (command in routingTable)
    routingTable[command](message, socket);
  else
    defaultHandler(message, socket);
}