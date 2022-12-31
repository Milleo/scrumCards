const request = require('supertest');
const { app } = require("../app");
const db = require('../database/models');
const status = require("http-status");

describe("Play endpoints", () => {
    let roomURI = null;
    let roundUUID = null;
    let ownerJWT = null;
    let playerJWT = null;

    const roomPayload = {
        name: "Test room",
        maxValue: 21,
        includeUnknownCard: false,
        includeCoffeeCard: true
    };

    beforeAll(async () => {
        // Create owner and player
        await db.sequelize.sync({ force: true });
        const responseOwner = await request(app).post("/users/guest").send({ userName: "roomOwner123" });
        ownerJWT = responseOwner.header["x-access-token"];
        const responsePlayer = await request(app).post("/users/guest").send({ userName: "Player_1" });
        playerJWT = responsePlayer.header["x-access-token"];

        // Create a new room
        const responseRoomCreation = await request(app)
            .post("/rooms")
            .set("Authorization", ownerJWT)
            .send(roomPayload);
        roomURI = responseRoomCreation.body.uri;

        // Player join the room
        await request(app).get(`/rooms/${roomURI}`).set("Authorization", playerJWT).send({ role: "player" });

        // Create a round
        const roundInfo = { title: "New round" }
        const newRoundResp = await request(app)
            .post(`/rooms/${roomURI}/round/start/`)
            .set("Authorization", ownerJWT)
            .send(roundInfo);
        roundUUID = newRoundResp.body.uuid;
    });
    it("Create a play", async () => {
        const playPayload = { cardValue: 8 };
        const response = await request(app).post(`/rooms/${roomURI}/round/${roundUUID}/play`).set("Authorization", playerJWT).send(playPayload);
        expect(response.statusCode).toBe(status.OK);

        const getPlay = await db.Play.findOne({ where: { uuid: response.body.uuid }});
        expect(getPlay.cardValue).toBe(playPayload.cardValue);
    });
    it("User not in the room tries to create a play", async () => {
        const responsePlayerNotInRoom = await request(app).post("/users/guest").send({ userName: "Player_2" });
        const playerNotInRoomJWT = responsePlayerNotInRoom.header["x-access-token"];
        const playPayload = { cardValue: 5 };
        const response = await request(app).post(`/rooms/${roomURI}/round/${roundUUID}/play`).set("Authorization", playerNotInRoomJWT).send(playPayload);
        expect(response.statusCode).toBe(status.NOT_FOUND);
    })
    it("Create a play with a invalid card value", async () => {
        const playPayload = { cardValue: 30 };
        const response = await request(app).post(`/rooms/${roomURI}/round/${roundUUID}/play`).set("Authorization", playerJWT).send(playPayload);
        expect(response.statusCode).toBe(status.BAD_REQUEST);
    });
    afterAll(async () => {
        await db.sequelize.close();
    });
});