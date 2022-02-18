import request from "supertest";
import express from "express";
import App from "../../../../../src/core/presentation/app";
import Database from "../../../../../src/core/infra/data/connections/database";

import UserRoutes from "../../../../../src/features/users/presentation/routes/routes";
import { UserRepository } from "../../../../../src/features/users/infra/repositories/user.repository";




describe("POST /signup", () => {
    //let server: express.Express;
    const database = new Database();
    const server = new App().server;

  beforeAll(async () => {
    await database.openConnection();
    
    server.use(express.json());
    server.use(new UserRoutes().init());
  });
  
    afterAll(async () => {
      jest.resetAllMocks();
      //await MessageEntity.clear();
      await database.closeConnection();
      
    });

    test("deve retornar 200 com o usuario criado no banco de dados", async () => {
        
    //passando um novo usuário  no BD  ** sempre passar um novo ao executar os testes **
        await request(server)
          .post(`/signup`)
          .send({
            name: "teste6",  
            pass: "test12",
            
            
          })
          .expect(200)
          .expect(async (res) => {
            expect(res.body.uid).toBeTruthy();
            expect(res.body.name).toBeTruthy();
            expect(res.body.pass).toBeTruthy();
            
    
          });
      });


      test("deve retornar 500 com Internal Server Error 1", async () => {
        
        //passando um user com mesmo nome na base
            await request(server)
              .post(`/signup`)
              .send({
                name: "teste4",  
                pass: "test12",
                
                
              })
              .expect(500, { error: "Internal Server Error", message: "User already exists with this name" });
          });

              

test("Deve retornar 500 com Internal Server Error 2", async () => {
    jest
      .spyOn(UserRepository.prototype, "verifyUserAlreadExistsByName")
      .mockRejectedValue(new Error("any_error"));

      await request(server)
      .post("/signup")
      .send()
      .expect(500, { error: "Internal Server Error", message: "any_error" });
  });



});