import request from "supertest";
import express from "express";
import App from "../../../../../src/core/presentation/app";
import Database from "../../../../../src/core/infra/data/connections/database";
import Redis from "../../../../../src/core/infra/data/connections/redis";
import MessageRoutes from "../../../../../src/features/messages/presentation/routes/routes";
import { MessageRepository } from "../../../../../src/features/messages/infra/repositories/message.repository";

//jest.mock("ioredis"); // ESTRATÉGIA 01 PARA TRABALHAR COM REDIS

 jest.mock("ioredis", () => require("ioredis-mock")); // ESTRATÉGIA 02 PARA TRABALHAR COM REDIS

describe("POST /message", () => {
  const database = new Database();
  const redis = new Redis();
  const server = new App().server;

  beforeAll(async () => {
    await database.openConnection();
    await redis.openConnection();
    server.use(express.json());
    server.use(new MessageRoutes().init());
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await database.closeConnection();
    await redis.closeConnection();
  });


  test("Deve retornar 200 com uma mensagem criada com todas as informações", async () => {
    // precisa enviar as informações na requisição
    // criar  no banco de dados
    // salvar no cache  criado
    // limpar a lista de  do cache


    await request(server)
      .post("/message")
      .send({
        user: "f1b5960c-5690-4191-ab1c-e215fc812715",  
        title: "any_name",
        description: "any_description",
        
      })
      .expect(200)
      .expect(async (res) => {
        console.log(res.body);
        //   const projectCreated = req.body
        expect(res.body.uid).toBeTruthy();
        expect(res.body.user).toBe("f1b5960c-5690-4191-ab1c-e215fc812715");
        expect(res.body.title).toBe("any_name");
        expect(res.body.description).toBe("any_description");
        

        const instanceRedis = await redis.getConnection();

        expect(instanceRedis.exists(`Kaian:message:${res.body.uid}`)).resolves.toBe(
            1
          );
  
          expect(instanceRedis.exists(`Kaian:messages:${res.body.user}`)).resolves.toBe(0);
        });
  });

  test("Deve retornar 400 com erro Usuário não encontrado", async () => {
    // precisa enviar as informações na requisição
    // criar  no banco de dados
    // salvar no cache  criado
    // limpar a lista de  do cache


    await request(server)
      .post("/message")
      .send({
        user: "f1b5960c-5690-4191-ab1c-e215fc812710",  
        title: "any_name",
        description: "any_description",
        
      })
      .expect(400, { error: "Usuário não encontrado" });
  });

 
  test("Deve retornar 500 com Internal Server Error", async () => {
    jest
      .spyOn(MessageRepository.prototype, "create")
      .mockRejectedValue(new Error("any_erro"));

    await request(server).post("/message").send().expect(500, {
      error: "Internal Server Error",
      message: "any_erro",
    });
  });
});