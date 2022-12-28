const request = require('supertest');
const { app } = require("../app");

describe("User endpoints", () => {
    let userNameTest = "Test_user_1";
    let userUUID = null;

    it("List Users", async () => {
        const response = await request(app).get("/users")
        expect(response.statusCode).toBe(200);
    });
    it("Create new User", async () => {
        const testPayload = {
            userName: userNameTest,
            email: "test1@test.com",
            password: "12345678"
        }

        const response = await request(app).post("/users").send(testPayload);
        expect(response.statusCode).toBe(200);
    });
    it("Get User", async () => {
        const response = await request(app).get(`/users/${userNameTest}`);
        expect(response.statusCode).toBe(200);
        const resJson = JSON.parse(response.text);
        userUUID = resJson.uuid;
    });
    it("Delete new User", async () => {
        const response = await request(app).delete(`/users/${userUUID}`)
        expect(response.statusCode).toBe(200);
    })
})