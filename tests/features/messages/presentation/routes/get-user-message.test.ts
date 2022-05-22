// deve buscar a lista de mensagens
// se não tiver nenhuma mensagem no banco, deve retornar um 404
// se acontecer um erro não tratado, deve retornar um 500 com uma mensagem

import request from "supertest";
import express from "express";
import { v4 as uuid } from "uuid";
import App from "../../../../../src/core/presentation/app";
import Database from "../../../../../src/core/infra/data/connections/database";
import Redis from "../../../../../src/core/infra/data/connections/redis";
import MessageRoutes from "../../../../../src/features/messages/presentation/routes/routes";
/* import { MessageRepository } from "../../infra/repositories/message.repository"; */
import { MessageEntity } from "../../../../../src/core/infra/data/database/entities/MessageEntity";


jest.mock("ioredis");

describe("GET /message", () => {
  const server = new App().server;
  const database = new Database();
  const redis = new Redis();

  beforeAll(async () => {
    
    server.use(express.json());
    server.use(new MessageRoutes().init());
    await database.openConnection();
    await redis.openConnection();
  });

  beforeEach(async () => {
    await MessageEntity.clear();
    /* await (await redis.getConnection()).flushall(); */
  });

  afterEach(async () => {
    await MessageEntity.clear();
    /* await (await redis.getConnection()).flushall(); */
  });

  

  afterAll(async () => {
    jest.resetAllMocks();
    /* await database.closeConnection();
    await redis.closeConnection(); */
  });

  

  test("deve retornar 200 com uma lista do banco de dados contendo 2 mensagens", async () => {
    const resource1 = await MessageEntity.create({
      title: "any_name11",
      description: "any_description11",
      userUID: "f1b5960c-5690-4191-ab1c-e215fc812715"
    }).save();

    const resource2 = await MessageEntity.create({
        title: "any_name22",
        description: "any_description22",
        userUID: "f1b5960c-5690-4191-ab1c-e215fc812715"
    }).save();

    await request(server)
      .get(`/message/user/${resource1.userUID}`)
      .send()
      .expect(200)
      .expect(async (res) => {
          console.log(res.body)
        expect(res.body).toHaveLength(2);
        expect(res.body[0]).toEqual({
            uid: resource1.uid,
            title: resource1.title,
            description: resource1.description,
            user: resource1.userUID,
          
        });
        expect(res.body[1]).toEqual({
            uid: resource2.uid,
            title: resource2.title,
            description: resource2.description,
            user: resource2.userUID,
          
        });

      });
  });

  test("deve retornar 0 com a mensagens", async () => {
    await request(server)
      .get(`/message/user/${uuid()}`)
      .send()
      .expect(async (res) => {
        console.log(res.body)
      expect(res.body).toHaveLength(0);
      

    })
      //.expect(404, { error: "Data not found" });
  });

  test("deve retornar 500 quando ocorrer um erro não tratado", async () => {
    jest
      .spyOn(MessageEntity, "find")
      .mockRejectedValue(new Error("any_error"));

    await request(server)
      .get("/message")
      .send()
      .expect(500, { error: "Internal Server Error", message: "any_error" });
  });
});