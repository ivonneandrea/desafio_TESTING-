import request from "supertest";
import app from "../index.js";
import { faker } from "@faker-js/faker";
import { generateToken } from "./utils/login.js";

describe("Coffees CRUD operations", () => {
    describe("GET /coffees", () => {
        it("Should respond with a 200 code status", async () => {
            const response = await request(app).get("/coffees").send();
            expect(response.status).toBe(200);
        });

        it("Should respond with an array and at least 1 object", async () => {
            const response = await request(app).get("/coffees");
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body[0]).toBeInstanceOf(Object);
        });
    });

    describe("GET /coffees/:id", () => {
        it("Should respond with a 200 code status when using a valid id", async () => {
            const response = await request(app).get("/coffees/1").send();
            expect(response.status).toBe(200);
        });

        it("Should respond with a 404 code status when using an invalid id", async () => {
            const invalidId = faker.string.alpha();
            const response = await request(app).get(`/coffees/${invalidId}`);
            expect(response.status).toBe(404);
        });
    });

    describe("POST /coffees", () => {
        it("Should respond with a 201 code status when using valid params", async () => {
            const payload = {
                id: faker.number.int({ min: 5, max: 999 }),
                name: faker.commerce.productName(),
            };
            const response = await request(app).post("/coffees").send(payload);
            expect(response.status).toBe(201);
        });

        it("Should respond with a 400 code status when using an existing id", async () => {
            const payload = {
                id: faker.number.int({ min: 1, max: 4 }),
                name: faker.commerce.productName(),
            };
            const response = await request(app).post("/coffees").send(payload);
            expect(response.status).toBe(400);
        });
    });

    describe("PUT /coffees/:id", () => {
        it("Should respond with a 400 code status when param id doesn't match with the coffee id", async () => {
            const invalidId = faker.string.alpha();
            const updateCoffee = {
                id: faker.string.numeric(undefined),
                name: "Updated coffee",
            };
            const response = await request(app)
                .put(`/coffees/${invalidId}`)
                .send(updateCoffee);
            expect(response.status).toBe(400);
        });

        it("Should respond with a 404 code status when there's no coffee with the provided id", async () => {
            const id = faker.string.alpha();
            const response = await request(app).get(`/coffees/${id}`);
            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /coffees/:id", () => {
        it("Erasing a coffee", async () => {
            const idToErase = 2;
            const token = generateToken();
            const { body: coffees } = await request(app)
                .delete(`/coffees/${idToErase}`)
                .set("Authorization", `Bearer ${token}`)
                .send();
            const ids = coffees.map((c) => c.id);
            expect(ids).not.toContain(idToErase);
        });

        it("Should respond with a 404 code status for an inexisting id", async () => {
            const invalidId = faker.string.alpha();
            const token = generateToken();
            const response = await request(app)
                .delete(`/coffees/${invalidId}`)
                .set("Authorization", `Bearer ${token}`)
                .send();
            expect(response.statusCode).toBe(404);
        });

        it("Should respond with a 400 code status using an invalid token", async () => {
            const payload = {
                id: 1,
                name: faker.commerce.productName(),
            };
            const response = await request(app)
                .delete(`/coffees/${payload.id}`)
                .send(payload)
            expect(response.statusCode).toBe(400);
        });
    });
});

describe("Not Found operation", () => {
    it("Should respond with a 404 code when visiting a non existing route", async () => {
        const response = await request(app).get("/melons").send();
        expect(response.status).toBe(404);
    });
});