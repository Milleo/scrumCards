const request = require('supertest');
const { app } = require("../app");
const db = require('../database/models');

describe("Rooms endpoints", () => {
    let roomUUID = null;
    let roomURI = null;
    let ownerJWT = null;
    let playersInfo = [];
    const roomPayload = {
        name: "Test room",
        maxValue: 21,
        includeUnknownCard: false,
        includeCoffeeCard: true
    };

    beforeAll(async () => {
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await db.sequelize.sync({ force: true });
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    });
    it("Create a room", async () => {
        const response = await request(app).post("/users/guest").send({ userName: "roomOwner123" });
        expect(response.statusCode).toBe(200);
        ownerJWT = response.header["x-access-token"];

        const responseRoomCreation = await request(app)
            .post("/rooms")
            .set("Authorization", ownerJWT)
            .send(roomPayload);
        roomUUID = responseRoomCreation.body.uuid;
        roomURI = responseRoomCreation.body.uri;
        expect(responseRoomCreation.statusCode).toBe(200);
    });
    it("Update room", async () => {
        const updatePayload = {
            name: "New name of test room",
            maxValue: 100,
            includeCoffeeCard: false,
            includeUnknownCard: true,
        }
        const responseRoomUpdate = await request(app)
            .put(`/rooms/${roomUUID}`)
            .set("Authorization", ownerJWT)
            .send(updatePayload);
        expect(responseRoomUpdate.statusCode).toBe(200);

        const resCheckRoom = await db.Room.findOne({ where: { uuid: roomUUID } });
        expect(resCheckRoom.dataValues).toEqual(
            expect.objectContaining(updatePayload)
        )
        
    });
    it("Join multiple players", async () => {
        const PLAYERS_QTY = 12;
        
        for(let i = 1; i <= PLAYERS_QTY; i++){
            const responseCreateGuest = await request(app).post("/users/guest").send({ userName: "player_" + i });
            const playerJWT = responseCreateGuest.header["x-access-token"];
            const playerUUID = responseCreateGuest.body.uuid;
            playersInfo.push({ jwt: playerJWT, uuid: playerUUID });

            const responseJoin = await request(app).get(`/rooms/${roomURI}`).set("Authorization", playerJWT).send({ role: "player" });

            expect(responseJoin.statusCode).toBe(200);
        }

        const result = await db.sequelize.query("SELECT * FROM users_rooms");
    });
    it("Ban user from room", async () => {
        const playerUUID = playersInfo[0].uuid;

        const responseBan = await request(app).get(`/rooms/${roomURI}/ban/${playerUUID}`).set("Authorization", ownerJWT);
        expect(responseBan.statusCode).toBe(200);
    });
    it("Banned user tries to join room", async () => {
        // Owner bans the player
        const playerJWT = playersInfo[1].jwt;
        const playerUUID = playersInfo[1].uuid;
        await request(app).get(`/rooms/${roomURI}/ban/${playerUUID}`).set("Authorization", ownerJWT);

        // Player tries to return
        const respBanned = await request(app).get(`/rooms/${roomURI}`).send({ role: "player" }).set("Authorization", playerJWT);
        expect(respBanned.statusCode).toBe(401);
    });
    it("Not owner tries to update room", async () => {
        const playerJWT = playersInfo[2].jwt;

        const updatePayload = {
            name: "Other name of the room",
            maxValue: 21,
            includeCoffeeCard: true,
            includeUnknownCard: true,
        }
        const responseRoomUpdate = await request(app).put(`/rooms/${roomUUID}`).set("Authorization", playerJWT).send(updatePayload);
        expect(responseRoomUpdate.statusCode).toBe(401);
    });
    it("Not owner tries to ban user from room", async () => {
        const playerJWT = playersInfo[3].jwt;
        const playerUUID = playersInfo[4].uuid;

        const responseBan = await request(app).get(`/rooms/${roomURI}/ban/${playerUUID}`).set("Authorization", playerJWT);
        expect(responseBan.statusCode).toBe(403);
    });
    afterAll(async () => {
        await db.sequelize.close();
    });
});