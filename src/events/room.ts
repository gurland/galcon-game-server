import { User } from "../models/User"

enum RoomState {
  Init = "init",
  Start = "start",
  End = "end"
}

export interface RoomStateChangeEvent {
  state: RoomState
}

export interface RoomUserJoin {
  user: User
}
