const request = require('supertest');
const { app } = require("../app");
const db = require('../database/models');

describe("Rooms endpoints", () => {
    let ownerUUID = null;
    let roomUUID = null;
    let roomURI = null;
    let ownerJWT = null;
    const roomPayload = {
        name: "Test room",
        maxValue: 21,
        includeUnknownCard: false,
        includeCoffeeCard: true
    };

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });
    it("Create a room", async () => {
        const response = await request(app).post("/users/guest").send({ userName: "roomOwner123" });
        expect(response.statusCode).toBe(200);
        ownerJWT = response.header["x-access-token"];
        console.log(ownerJWT);

        const getUserResp = await request(app).get(`/users/roomOwner123`);
        ownerUUID = getUserResp.body.uuid;
        
        roomPayload.owner = ownerUUID;


        const responseRoomCreation = await request(app).post("/rooms").send(roomPayload);
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
            .send({ owner: ownerUUID, ...updatePayload })
            .set("Authorization", ownerJWT);
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
            const playerUUID = responseCreateGuest.body.uuid;

            const responseJoin = await request(app).get(`/rooms/${roomURI}`).send({ ownerUUID: playerUUID, role: "player" });

            expect(responseJoin.statusCode).toBe(200);
        }
    });
    it("Ban user from room", async () => {
        const responseCreateGuest = await request(app).post("/users/guest").send({ userName: "inapropriateUser" });
        const playerUUID = responseCreateGuest.body.uuid;

        const responseBan = await request(app).get(`/rooms/${roomURI}/ban/${playerUUID}`);
        expect(responseBan.statusCode).toBe(200);
    });
    it("Banned user tries to join room", async () => {
        const responseCreateGuest = await request(app).post("/users/guest").send({ userName: "inapropriateUser" });
        const playerUUID = responseCreateGuest.body.uuid;

        await request(app).get(`/rooms/${roomURI}`).send({ ownerUUID: playerUUID, role: "player" });
        await request(app).get(`/rooms/${roomURI}/ban/${playerUUID}`);
        const respBanned = await request(app).get(`/rooms/${roomURI}`).send({ ownerUUID: playerUUID, role: "player" });
        expect(respBanned.statusCode).toBe(401);
    });
    it("Not owner tries to update room", async () => {
        const responseCreateGuest = await request(app).post("/users/guest").send({ userName: "inapropriateUser" });
        const playerUUID = responseCreateGuest.body.uuid;

        const updatePayload = {
            name: "Other name of the room",
            maxValue: 21,
            includeCoffeeCard: true,
            includeUnknownCard: true,
            owner: playerUUID
        }
        const responseRoomUpdate = await request(app).put(`/rooms/${roomUUID}`).send(updatePayload);
        expect(responseRoomUpdate.statusCode).toBe(401);
    });
    afterAll(async () => {
        await db.sequelize.close();
    })
});