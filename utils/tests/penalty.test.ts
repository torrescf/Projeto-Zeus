import request from "supertest";
import { app } from "../../src/app/index";

describe("Penalty Endpoints", () => {
    it("should create a penalty", async () => {
        const response = await request(app)
            .post("/penalty")
            .send({ type: "warning", reason: "Test reason", date: "2023-10-01", memberId: 1 });
        expect(response.status).toBe(201);
    });

    it("should get all penalties", async () => {
        const response = await request(app).get("/penalty");
        expect(response.status).toBe(200);
    });

    it("should get a penalty by ID", async () => {
        const response = await request(app).get("/penalty/1");
        expect(response.status).toBe(200);
    });

    it("should update a penalty", async () => {
        const response = await request(app).put("/penalty/1").send({ reason: "Updated reason" });
        expect(response.status).toBe(204);
    });

    it("should delete a penalty", async () => {
        const response = await request(app).delete("/penalty/1");
        expect(response.status).toBe(204);
    });
});
