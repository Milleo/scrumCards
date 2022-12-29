const request = require('supertest');
const { app } = require("../app");
const db = require('../database/models');

describe("Rooms endpoints", () => {
    let userUUID = null;
    let roomUUID = null;
    let roomURI = null;
    const playersUUIDs = [];
    const roomPayload = {
        roomName: "Test room",
        maxValue: 21,
        includeUnknownCard: false,
        includeCoffeeCard: true
    };

    it("Create a room", async () => {
        const response = await request(app).post("/users/guest").send({ userName: "roomOwner123" });
        expect(response.statusCode).toBe(200);

        const getUserResp = await request(app).get(`/users/roomOwner123`);
        userUUID = getUserResp.body.uuid;
        roomPayload.owner = userUUID;

        const responseRoomCreation = await request(app).post("/rooms").send(roomPayload);
        roomUUID = responseRoomCreation.body.uuid;
        roomURI = responseRoomCreation.body.uri;
        console.log(responseRoomCreation.body);
        expect(responseRoomCreation.statusCode).toBe(200);
    });
    it("Update room", async () => {
        const updatePayload = {
            roomName: "New name of test room",
            maxValue: 100,
            includeCoffeeCard: false,
            includeUnknownCard: true,
            owner: userUUID
        }
        const responseRoomUpdate = await request(app).put(`/rooms/${roomUUID}`).send(updatePayload);
        expect(responseRoomUpdate.statusCode).toBe(200);
    });
    it("Join multiple players", async () => {
        const PLAYERS_QTY = 12;
        
        for(let i = 1; i <= PLAYERS_QTY; i++){
            const responseCreateGuest = await request(app).post("/users/guest").send({ userName: "player_" + i });
            const playerUUID = responseCreateGuest.body.uuid;
            playersUUIDs.push(playerUUID);
            
            console.log(responseCreateGuest.body);
            const responseJoin = await request(app).get(`/rooms/${roomURI}`).send({ userUUID: playerUUID, role: "player" });
            console.log(responseJoin.body);
            expect(responseJoin.statusCode).toBe(200);
        }

        
    });
    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 2000));
        db.User.destroy({ where: { uuid: playersUUIDs }, force: true });
        db.Room.destroy({ where: { uuid: roomUUID }, force: true }).then(() => {
            db.User.destroy({ where: { uuid: userUUID }, force: true });
        });
    })
});