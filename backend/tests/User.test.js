const request = require('supertest');
const { app } = require("../app");
const db = require('../database/models');
const status = require("http-status");

describe("User endpoints", () => {
    let userNameTest = "Test_user_1";
    let userUUID = null;
    const testPayload = {
        userName: userNameTest,
        email: "test1@test.com",
        password: "12345678"
    }

    beforeAll(async () => {
        await db.sequelize.sync({ force: true });
    });
    it("List Users", async () => {
        const response = await request(app).get("/users")
        expect(response.statusCode).toBe(status.OK);
    });
    it("Create new user", async () => {
        const response = await request(app).post("/users").send(testPayload);
        expect(response.statusCode).toBe(status.OK);
    });
    it("Create new guest user", async () => {
        const response = await request(app).post("/users/guest").send({ userName: "Guest_user_123"});
        expect(response.statusCode).toBe(status.OK);
    });
    it("Try to create user with same e-mail", async () => {
        const otherUser = {...testPayload};
        otherUser.userName = "Another_user_name";
        const response = await request(app).post("/users").send(otherUser);
        expect(response.statusCode).toBe(status.BAD_REQUEST);
        expect(response.body.errors[0].msg).toBe("Email already signed");
    });
    it("Try to create user with same username", async () => {
        const otherUser = {...testPayload};
        otherUser.email = "test2@test.com";
        const response = await request(app).post("/users").send(otherUser);
        expect(response.statusCode).toBe(status.BAD_REQUEST);
        expect(response.body.errors[0].msg).toBe("User name already taken");
    });
    it("Get User", async () => {
        const response = await request(app).get(`/users/${userNameTest}`);
        expect(response.statusCode).toBe(status.OK);
        userUUID = response.body.uuid;
    });
    it("Delete new User", async () => {
        const response = await request(app).delete(`/users/${userUUID}`)
        expect(response.statusCode).toBe(status.OK);
    })
    it("Confirm user deletion", async () => {
        const response = await request(app).get(`/users/${userNameTest}`);
        expect(response.statusCode).toBe(status.NOT_FOUND);
    });
    afterAll(async () => {
        await db.sequelize.close();
    });
});

