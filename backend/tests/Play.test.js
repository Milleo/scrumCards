const request = require('supertest');
const { app } = require("../app");
const db = require('../database/models');

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
        await db.sequelize.sync({ force: true });
        const responseOwner = await request(app).post("/users/guest").send({ userName: "roomOwner123" });
        ownerJWT = responseOwner.header["x-access-token"];
        const responsePlayer = await request(app).post("/users/guest").send({ userName: "roomOwner123" });
        playerJWT = responsePlayer.header["x-access-token"];
        const responseRoomCreation = await request(app)
            .post("/rooms")
            .set("Authorization", ownerJWT)
            .send(roomPayload);
        roomURI = responseRoomCreation.body.uri;
        const roundInfo = {
            title: "New round"
        }
        await request(app).get(`/rooms/${roomURI}`).set("Authorization", playerJWT).send({ role: "player" });
        const newRoundResp = await request(app)
            .post(`/rooms/${roomURI}/round/start/`)
            .set("Authorization", ownerJWT)
            .send(roundInfo);
        roundUUID = newRoundResp.body.uuid;
    });
    it("Create a play", async () => {
        const playPayload = {
            cardValue: 8
        }
        const response = await request(app).post(`/rooms/${roomURI}/round/${roundUUID}/play`).set("Authorization", playerJWT).send(playPayload);
        expect(response.statusCode).toBe(200);

        const getPlay = await db.Play.findOne({ where: { uuid: response.body.uuid }});
        expect(getPlay.cardValue).toBe(playPayload.cardValue);
    });
    afterAll(async () => {
        await db.sequelize.close();
    });
});