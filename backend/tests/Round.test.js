const request = require('supertest');
const { app } = require("../app");
const db = require('../database/models');

describe("Round endpoints", () => {
    let ownerJWT = null;
    let playerJWT = null;
    let roomURI = null;
    let roundUUID = null;

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
    });

    it("Create a new round", async () => {
        const roundInfo = {
            title: "New round"
        }
        const newRoundResp = await request(app)
            .post(`/rooms/${roomURI}/round/start/`)
            .set("Authorization", ownerJWT)
            .send(roundInfo);
        expect(newRoundResp.statusCode).toBe(200);
        expect(newRoundResp.body).toHaveProperty("uuid");
        roundUUID = newRoundResp.body.uuid;
    });

    it("Create round in inexistent room", async () => {
        const roundInfo = {
            title: "New round"
        }
        const newRoundResp = await request(app)
            .post(`/rooms/INVALID_URI/round/start/`)
            .set("Authorization", ownerJWT)
            .send(roundInfo);
        expect(newRoundResp.statusCode).toBe(404);
    });

    it("Not owner tries to create a new round", async () => {
        const roundInfo = { title: "New round" }
        const newRoundResp = await request(app)
            .post(`/rooms/${roomURI}/round/start/`)
            .set("Authorization", playerJWT)
            .send(roundInfo);
        expect(newRoundResp.statusCode).toBe(403);
    });

    it("Update round", async () => {
        const roundInfo = { title: "Other title" };
        const roundUpdate = await request(app)
            .put(`/rooms/${roomURI}/round/${roundUUID}`)
            .set("Authorization", ownerJWT)
            .send(roundInfo);
        expect(roundUpdate.statusCode).toBe(200);

        const checkRound = await db.Round.findOne({ where: { uuid: roundUUID }});
        expect(checkRound.title).toBe(roundInfo.title);
    });

    it("Not owner tries to update round", async () => {
        const roundInfo = { title: "Other title" };
        const roundUpdate = await request(app)
            .put(`/rooms/${roomURI}/round/${roundUUID}`)
            .set("Authorization", playerJWT)
            .send(roundInfo);
        expect(roundUpdate.statusCode).toBe(403);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});