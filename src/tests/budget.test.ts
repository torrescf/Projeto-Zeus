import request from "supertest";
import { app } from "../index";

describe("Budget Approval Flow", () => {
    it("should update budget status to 'approved'", async () => {
        const response = await request(app)
            .put("/budget/1")
            .send({ status: "approved" });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe("approved");
    });

    it("should list budgets with status 'pending'", async () => {
        const response = await request(app)
            .get("/budget?status=pending");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should send budget for approval", async () => {
        const response = await request(app)
            .put("/budget/1/send-for-approval");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Budget sent for approval");
    });

    it("should list pending budgets", async () => {
        const response = await request(app)
            .get("/budget/pending");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
