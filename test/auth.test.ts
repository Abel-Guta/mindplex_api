
import { describe, expect, it, beforeAll, afterAll } from "bun:test";
import { api, seed, cleanup, type SeededData } from "./setup";

let s: SeededData;

beforeAll(async () => {
  s = await seed();
});

afterAll(async () => {
  await cleanup();
});


describe("GET /v1/auth/check-username", () => {
  it("returns available: true for a username that does not exist", async () => {
    const res = await api.get("/v1/auth/check-username", {
      query: { username: "completely_unique_xyzabc_9999" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.available).toBe(true);
  });

  it("returns available: false for an existing username", async () => {
    const res = await api.get("/v1/auth/check-username", {
      query: { username: s.users.user.username },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.available).toBe(false);
    expect(body.message).toBe("Username is already taken");
  });

  it("returns available: false regardless of case (ILIKE check)", async () => {
    const res = await api.get("/v1/auth/check-username", {
      query: { username: s.users.user.username.toUpperCase() },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.available).toBe(false);
  });

  it("returns 400 when username param is missing", async () => {
    const res = await api.get("/v1/auth/check-username");
    expect(res.status).toBe(400);
  });
});
