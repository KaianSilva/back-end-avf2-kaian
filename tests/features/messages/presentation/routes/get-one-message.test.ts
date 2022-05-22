import request from "supertest";
import express from "express";
import { v4 as uuid } from "uuid";
import App from "../../../../../src/core/presentation/app";
import Database from "../../../../../src/core/infra/data/connections/database";
import Redis from "../../../../../src/core/infra/data/connections/redis";
import MessageRoutes from "../../../../../src/features/messages/presentation/routes/routes";
import { MessageRepository } from "../../../../../src/features/messages/infra/repositories/message.repository";
import { MessageEntity } from "../../../../../src/core/infra/data/database/entities/MessageEntity";


jest.mock("ioredis");

const makeMessageDB = async (): Promise<MessageEntity> => {
  return await MessageEntity.create({
    userUID: "f1b5960c-5690-4191-ab1c-e215fc812715",
    title: "any_title",
    description: "any_description"
    
  }).save();
};

describe("GET /message/UID", () => {
  const server = new App().server;
  const database = new Database();
  const redis = new Redis();

  beforeAll(async () => {
    
    server.use(express.json());
    server.use(new MessageRoutes().init());
    await database.openConnection();
    await redis.openConnection();
  });

  afterAll(async () => {
    jest.resetAllMocks();
    await MessageEntity.clear();
    /* await database.closeConnection();
    await (await redis.getConnection()).flushall();
    await redis.closeConnection(); */
  });

  /* test("deve retornar 200 com a mensagem encontrado no cache", async () => {
    const message = await makeMessageDB();

    const redisConnection = await redis.getConnection();

    await redisConnection.set(
      `Kaian:message:${message.uid}`,
      JSON.stringify(message)
    );

    await request(server)
      .get(`/message/${message.uid}`)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.uid).toBe(message.uid);
        expect(res.body.title).toBe(message.title);
        expect(res.body.description).toBe(message.description);
        expect(res.body.user).toBe(message.userUID);
        
        expect(res.body._cache).toBeTruthy();
      });
  }); */

  test("deve retornar 200 com a mensagem encontrada no banco de dados", async () => {
    const message = await makeMessageDB();

    await request(server)
      .get(`/message/${message.uid}`)
      .send()
      .expect(200)
      .expect(async (res) => {
        expect(res.body.uid).toBe(message.uid);
        expect(res.body.title).toBe(message.title);
        expect(res.body.description).toBe(message.description);
        expect(res.body.user).toBe(message.userUID);
        expect(res.body._cache).toBeFalsy();

        /* const redisConnection = await redis.getConnection();

        await expect(
          redisConnection.exists(`Kaian:message:${res.body.uid}`)
        ).resolves.toBe(1); */
      });
  });

  test("deve retornar 404 quando mensagem não for encontrada", async () => {
    await request(server)
      .get(`/message/${uuid()}`)
      .send()
      .expect(404, { error: "Data not found" });
  });

  test("deve retornar 500 quando ocorrer um erro não tratado", async () => {
    jest
      .spyOn(MessageRepository.prototype, "getByUid")
      .mockRejectedValue(new Error("any_error"));

    await request(server)
      .get("/message/uid_error_nao_tratado")
      .send()
      .expect(500, { error: "Internal Server Error", message: "any_error" });
  });
});