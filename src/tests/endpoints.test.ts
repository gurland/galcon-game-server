import supertest from 'supertest';
import {app} from '../app';
import * as fs from "fs";

let token: string;
let roomId: number;

beforeAll(async () => {
  await fs.unlink("database.sqlite", () => null);
  await new Promise((resolve) => setTimeout(resolve, 500));
});


describe("/api", () => {

  it("healthcheck passes", async () => {
    const response = await supertest(app).get("/api");
    expect(response.status).toBe(200);
    expect(response.body?.message).toEqual("Healthcheck OK.")
  });
});


describe("/api/users", () => {

  it("throws an error when trying to create a user without username and/or password", async () => {
    const response = await supertest(app).post("/api/users").send({
      password: "test_password",
    });
    expect(response.status).toBe(400);
    const response2 = await supertest(app).post("/api/users").send({
      username: "test_user",
    })
    expect(response2.status).toBe(400);
    const response3 = await supertest(app).post("/api/users").send({})
    expect(response3.status).toBe(400);
  })

  it("creates a new user and returns token", async () => {
    const response = await supertest(app).post("/api/users").send({
      username: "test_user",
      password: "test_password",
    });
    expect(response.status).toBe(200);
    expect(response.body?.token).toBeDefined();
    token = response.body?.token;
  })

  it("throws an error when trying to create a user with the same username", async () => {
    const response = await supertest(app).post("/api/users").send({
      username: "test_user",
      password: "test_password",
    });
    expect(response.status).toBe(409);
    expect(response.body?.message).toEqual("User already exists");
  })
});


describe("/api/rooms", () => {

  it("throws an error when no token is provided", async () => {
    const response = await supertest(app).get("/api/rooms");
    expect(response.status).toBe(401);
    expect(response.body?.message).toEqual("No Authorization header provided!");
  })

  it("returns an empty list of rooms", async () => {
    const response = await supertest(app).get("/api/rooms").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  })

  it("creates a new room", async () => {
    const response = await supertest(app).post("/api/rooms").set("Authorization", `Bearer ${token}`).send({
      name: "test_room",
    });
    expect(response.status).toBe(200);
    expect(response.body?.id).toBeDefined();
    roomId = response.body?.id;
  })

  it("owner of the room is the user who created it", async () => {
    const response = await supertest(app).get(`/api/rooms/${roomId}`).set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body?.owner.username).toBe('test_user');
  })

  it("returns a list with newly created room", async () => {
    const response = await supertest(app).get("/api/rooms").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  })

})


describe("/api/rooms/:id", () => {

  it("returns a room by id", async () => {
    const response = await supertest(app).get(`/api/rooms/${roomId}`).set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body?.id).toBe(roomId);
  })
})