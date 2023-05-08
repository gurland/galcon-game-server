export interface Room {
  id: number;
  users: User[];
  map: PlanetMap;
  chat: Chat;
}

interface User {
  id: number;
  username: string;
  password: string;
}

interface Chat {
  messages: Message[];
}

interface Message {
  author: User;
  text: string;
}

interface PlanetMap {
  planets: Planet[];
}

interface Planet {
  id: number;
  owner: User | null;
  production: number;
  units: number;
}
