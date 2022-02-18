// deve buscar a lista de mensagens
// se não tiver nenhuma mensagem no banco, deve retornar um 404
// se acontecer um erro não tratado, deve retornar um 500 com uma mensagem

import request from "supertest";
import express from "express";
import { v4 as uuid } from "uuid";
import App from "../../../../core/presentation/app";
import Database from "../../../../../src/core/infra/data/connections/database";
import Redis from "../../../../../src/core/infra/data/connections/redis";
import MessageRoutes from "../../../../../src/features/messages/presentation/routes/routes";
import { MessageRepository } from "../../infra/repositories/message.repository";
import { MessageEntity } from "../../../../../src/core/infra/data/database/entities/MessageEntity";


jest.mock("ioredis", () => require("ioredis-mock"));

const makeMessageDB = async (): Promise<MessageEntity[]> => {
  return await MessageEntity.find()
};


describe("GET /message", () => {
  let server: express.Express;
  const database = new Database();
  const redis = new Redis();

  beforeAll(async () => {
    server = express();
    server.use(express.json());
    server.use(new MessageRoutes().init());
    await database.openConnection();
    await redis.openConnection();
  });

 /*  afterEach(async () => {
    await MessageEntity.clear();
    await (await redis.getConnection()).flushall();
  }); */

  afterAll(async () => {
    jest.resetAllMocks();
    await database.closeConnection();
    await redis.closeConnection();
  });

  test("deve retornar 200 com todas as mensagens no banco de dados", async () => {
    const message = await makeMessageDB();

    await request(server)
      .get(`/message`)
      .send()
      .expect(200)
      .expect(async (res) => {
        expect(res.body).toEqual(message.map(message => {
          return {
            description: message.description,
            title: message.title,
            uid: message.uid,
            user: message.userUID
          }
        }));
       
      });
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