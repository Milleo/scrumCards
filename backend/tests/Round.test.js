const request = require('supertest');
const { app } = require("../app");
const db = require('../database/models');
const status = require("http-status");

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
        ownerJWT = responseOwner.header["set-cookie"];
        const responsePlayer = await request(app).post("/users/guest").send({ userName: "roomOwner123" });
        playerJWT = responsePlayer.header["set-cookie"];
        const responseRoomCreation = await request(app)
            .post("/rooms")
            .set("Cookie", ownerJWT)
            .send(roomPayload);
        roomURI = responseRoomCreation.body.uri;
    });

    it("Create a new round", async () => {
        const roundInfo = {
            title: "New round"
        }
        const newRoundResp = await request(app)
            .post(`/rooms/${roomURI}/round/start/`)
            .set("Cookie", ownerJWT)
            .send(roundInfo);
        expect(newRoundResp.statusCode).toBe(status.OK);
        expect(newRoundResp.body).toHaveProperty("uuid");
        roundUUID = newRoundResp.body.uuid;
    });

    it("Create round in inexistent room", async () => {
        const roundInfo = {
            title: "New round"
        }
        const newRoundResp = await request(app)
            .post(`/rooms/INVALID_URI/round/start/`)
            .set("Cookie", ownerJWT)
            .send(roundInfo);
        expect(newRoundResp.statusCode).toBe(status.NOT_FOUND);
    });

    it("Not owner tries to create a new round", async () => {
        const roundInfo = { title: "New round" }
        const newRoundResp = await request(app)
            .post(`/rooms/${roomURI}/round/start/`)
            .set("Cookie", playerJWT)
            .send(roundInfo);
        expect(newRoundResp.statusCode).toBe(status.UNAUTHORIZED);
    });

    it("Update round", async () => {
        const roundInfo = { title: "Other title" };
        const roundUpdate = await request(app)
            .put(`/rooms/${roomURI}/round/${roundUUID}`)
            .set("Cookie", ownerJWT)
            .send(roundInfo);
        expect(roundUpdate.statusCode).toBe(status.OK);

        const checkRound = await db.Round.findOne({ where: { uuid: roundUUID }});
        expect(checkRound.title).toBe(roundInfo.title);
    });

    it("Not owner tries to update round", async () => {
        const roundInfo = { title: "Other title" };
        const roundUpdate = await request(app)
            .put(`/rooms/${roomURI}/round/${roundUUID}`)
            .set("Cookie", playerJWT)
            .send(roundInfo);
        expect(roundUpdate.statusCode).toBe(status.UNAUTHORIZED);
    });

    it("Room owner ends a round", async () => {
        const checkRoundBefore = await db.Round.findOne({ where: { uuid: roundUUID }});
        expect(checkRoundBefore.ended).toBe(false);

        const response = await request(app)
            .get(`/rooms/${roomURI}/round/${roundUUID}/end`)
            .set("Cookie", ownerJWT);
        expect(response.statusCode).toBe(status.OK);

        const checkRoundAfter = await db.Round.findOne({ where: { uuid: roundUUID }});
        expect(checkRoundAfter.ended).toBe(true);
    });

    it("Create multiple rounds and keep the correct value of order", async () => {
        const responseRoomCreation = await request(app)
            .post("/rooms")
            .set("Cookie", ownerJWT)
            .send(roomPayload);
        const newRoomURI = responseRoomCreation.body.uri;

        const TEST_CASES = 5;
        for(let i = 0; i < TEST_CASES; i++){
            await request(app)
                .post(`/rooms/${newRoomURI}/round/start/`)
                .set("Cookie", ownerJWT)
                .send({});
        }

        const getRoom = await db.Room.findOne({ where: { uri: newRoomURI }});

        let checkOrder = await db.Round.findOne({ where: { room_id: getRoom.id }, order: [["order", "DESC"]]});
        expect(checkOrder.order).toBe(TEST_CASES);

        await request(app).delete(`/rooms/${newRoomURI}/round/${checkOrder.uuid}`).set("Cookie", ownerJWT);
        checkOrder = await db.Round.findOne({ where: { room_id: getRoom.id }, order: [["order", "DESC"]]});
        expect(checkOrder.order).toBe(TEST_CASES - 1);

        await request(app).post(`/rooms/${newRoomURI}/round/start/`).set("Cookie", ownerJWT).send({});
        checkOrder = await db.Round.findOne({ where: { room_id: getRoom.id }, order: [["order", "DESC"]]});
        expect(checkOrder.order).toBe(TEST_CASES);
    })

    it("Delete round", async () => {
        const roundUpdate = await request(app)
            .delete(`/rooms/${roomURI}/round/${roundUUID}`)
            .set("Cookie", ownerJWT);
        expect(roundUpdate.statusCode).toBe(status.OK);

        const checkRound = await db.Round.findOne({ where: { uuid: roundUUID }});
        expect(checkRound).toBe(null);
    });

    it("Not owner tries to delete round", async () => {
        const roundUpdate = await request(app)
            .delete(`/rooms/${roomURI}/round/${roundUUID}`)
            .set("Cookie", playerJWT);
        expect(roundUpdate.statusCode).toBe(status.UNAUTHORIZED);
    });

    afterAll(async () => {
        await db.sequelize.close();
    });
});