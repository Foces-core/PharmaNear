import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";

describe("Server basic endpoints", () => {
  afterAll(async () => {
    // Close mongoose connection to prevent jest from hanging
    await mongoose.connection.close();
  });

  it("should respond to the root route", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("server check");
  });
});
