import {httpServer, io} from "../app";

import Client, {Socket} from "socket.io-client";
import * as fs from "fs";
import {RoomState} from "../events/base";


let clientSocket1: Socket;
let clientSocket2: Socket;
let clientSocket3: Socket;
let port: number;
let planets: any[] = [];
let planetIdRange = 8;

function getNonOwnedPlanetId() {
  const ownedPlanetIds = [...new Set(planets.map((planet) => planet.id))];
  const randomPlanetId = Math.floor(Math.random() * planetIdRange);
  if (ownedPlanetIds.includes(randomPlanetId))
    return getNonOwnedPlanetId();
  return randomPlanetId;
}

async function createUser(id: number) {
  return await fetch(`http://localhost:${port}/api/users`, {
    method: "POST", body: JSON.stringify({
      username: `test_user_${id}`,
      password: "test_password",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json()).then((res) => res.token);
}

async function createRoom(token: string) {
  return await fetch(`http://localhost:${port}/api/rooms`, {
    method: "POST", body: JSON.stringify({
      name: "test_room",
      description: "test_description",
    }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }).then((res) => res.json()).then((res) => res.id);
}

async function createClientSocket(token: string, roomId: number) {
  const client = Client(`http://localhost:${port}`, {auth: {token}, query: {roomId}});

  await new Promise((resolve, reject) => {
    client.on("connect", () => {
      console.log("client connected");
      resolve(client);
    });
    client.on("connect_error", (err: any) => {
      console.error("client error", err);
      reject(err);
    });
    client.on("disconnect", (err) => {
      console.log("client disconnected", roomId, err);
    });
    // @ts-ignore
    client.on("ErrorEvent", (err) => {
      console.log("client error event", err);
    });
    client.on("PlanetOccupiedEvent", (planet) => {
      console.log(planet);
      planets.push(planet);
    });
    client.onAny((event, ...args) => {
      console.log("client event", event, args);
    });
  });
  return client;
}

beforeAll((done) => {
  fs.unlinkSync("db/database.sqlite");
  httpServer.listen(async () => {
    port = (httpServer.address() as any).port as number;

    const token1 = await createUser(1);
    const token2 = await createUser(2);
    const token3 = await createUser(3);
    const room1 = await createRoom(token1);
    const room2 = await createRoom(token3);

    clientSocket1 = await createClientSocket(token1, room1);
    clientSocket2 = await createClientSocket(token2, room1);
    clientSocket3 = await createClientSocket(token3, room2);
    done();
  });
});

afterAll(() => {
  io.sockets.removeAllListeners();
  io.close();
  clientSocket1.close();
  clientSocket2.close();
  clientSocket3.close();
  httpServer.removeAllListeners();
  httpServer.closeAllConnections();
  httpServer.close();
});


describe("room connection", () => {

  test("clients are connected", () => {
    expect(clientSocket1.connected).toBe(true);
  });
});

describe("chat", () => {

  test("user from another room cant read chat", async () => {
    const spy = jest.fn();
    clientSocket3.on("ChatMessageEvent", spy);
    expect(spy).not.toBeCalled();
  });

  test("chat message gets emitted from one client to another", (done) => {
    clientSocket1.on("ChatMessageEvent", (arg) => {
      expect(arg.text).toBe("hello world");
      done();
    });

    clientSocket2.emit("ChatMessageEvent", {text: "hello world"});
  });
});

describe("game", () => {

  test("cant start game with one player", (done) => {
    clientSocket3.on("ErrorEvent", (arg) => {
      expect(arg.message).toBeDefined();
      done();
    });
    clientSocket3.emit("RoomStateChangeEvent", {state: RoomState.Start});
  });

  test("can't send batch before game starts", (done) => {
    clientSocket3.on("ErrorEvent", (arg) => {
      expect(arg.message).toBeDefined();
      done();
    });

    clientSocket3.emit("BatchSendEvent", {
      count: 1,
      currentY: 0,
      currentX: 0,
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0,
      ownerId: 0,
      toPlanetId: 0,
      fromPlanetId: 1,
      newFromPlanetUnits: 4,
      id: "",
    });
  });

  test("game starts when 2+ players", (done) => {
    clientSocket2.on("RoomStateChangeEvent", (arg) => {
      expect(arg.state).toBe(RoomState.Start);
      done();
    });
    clientSocket1.emit("RoomStateChangeEvent", {state: RoomState.Start});
  });

  test("can't send batch from planet you don't own", (done) => {
    clientSocket2.on("ErrorEvent", (arg) => {
      expect(arg.message).toBeDefined();
      done();
    });

    clientSocket2.emit("BatchSendEvent", {
      count: 1,
      currentY: 0,
      currentX: 0,
      fromX: 0,
      fromY: 0,
      toX: 10,
      toY: 10,
      ownerId: 10,
      toPlanetId: 7,
      fromPlanetId: getNonOwnedPlanetId(),
      newFromPlanetUnits: 4,
      id: "",
    });
  });
});
