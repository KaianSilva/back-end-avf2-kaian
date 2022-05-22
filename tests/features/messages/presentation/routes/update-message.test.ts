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

describe("PUT /message/UID", () => {
  const server = new App().server;
  const database = new Database();
  const redis = new Redis();

  beforeAll(async () => {
    
    server.use(express.json());
    server.use(new MessageRoutes().init());
    await database.openConnection();
    await redis.openConnection();
  });

  afterEach(async () => {
    
    await MessageEntity.clear();
  });

  

  afterAll(async () => {
    jest.resetAllMocks();
    await MessageEntity.clear();
    /* await database.closeConnection();
    await (await redis.getConnection()).flushall();
    await redis.closeConnection(); */
  });

  

  test("deve retornar 200 com a mensagem alterada", async () => {
    const message = await makeMessageDB();

    await request(server)
      .put(`/message/${message.uid}`)
      .send({
        user: "f1b5960c-5690-4191-ab1c-e215fc812715",  
        title: "any_name",
        description: "any_description",
        
      })
      .expect(200)
      .expect(async (res) => {
        console.log(res.body);
        expect(res.body.uid).toBeTruthy();
        expect(res.body.title).toBe("any_name");
        expect(res.body.description).toBe("any_description");
        
        
        });
  });

  test("deve retornar 404 quando mensagem não for encontrada", async () => {
    await request(server)
      .put(`/message/${uuid()}`)
      .send()
      .expect(404, { error: "Data not found" });
  });
  

  test("deve retornar 500 quando ocorrer um erro não tratado", async () => {
    jest
      .spyOn(MessageRepository.prototype, "editMessage")
      .mockRejectedValue(new Error("any_error"));

    await request(server)
      .put("/message/uid_error_nao_tratado")
      .send()
      .expect(500, { error: "Internal Server Error", message: 'any_error' });
  });
});