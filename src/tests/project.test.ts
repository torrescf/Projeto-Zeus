import request from "supertest";
import app from "../app";

let authToken: string;
let memberId: number;
let clientId: number;

beforeAll(async () => {
  // Create a member for authentication
  const member = await request(app)
    .post("/auth/register")
    .send({
      name: "Project Test",
      email: "project@compjunior.com.br",
      password: "password123",
      role: "admin"
    });
  
  memberId = member.body.id;

  // Login to obtain token
  const login = await request(app)
    .post("/auth/login")
    .send({
      email: "project@compjunior.com.br",
      password: "password123"
    });
  
  authToken = login.body.token;

  // Create a client for the project
  const client = await request(app)
    .post("/client")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      name: "Project Client",
      email: "projectclient@example.com",
      phone: "123456789"
    });
  
  clientId = client.body.id;
});

describe("Project Controller", () => {
  it("should create a project with team", async () => {
    // Criar outro membro para a equipe
    const teamMember = await request(app)
      .post("/auth/register")
      .send({
        name: "Team Member",
        email: "teammember@compjunior.com.br",
        password: "password123",
        role: "member"
      });

    const response = await request(app)
      .post("/project")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "Team Project",
        description: "Project with team",
        status: "planning",
        clientId,
        leaderId: memberId,
        teamIds: [teamMember.body.id]
      });

    expect(response.status).toBe(201);
    expect(response.body.team.length).toBe(1);
    expect(response.body.leader.id).toBe(memberId);
  });

  // ...existing tests...
});