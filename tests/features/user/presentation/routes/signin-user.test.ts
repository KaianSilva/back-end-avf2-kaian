import request from "supertest";
import express from "express";
import App from "../../../../../src/core/presentation/app";
import Database from "../../../../../src/core/infra/data/connections/database";

import UserRoutes from "../../../../../src/features/users/presentation/routes/routes";
import { UserRepository } from "../../../../../src/features/users/infra/repositories/user.repository";
import { UserEntity } from "../../../../../src/core/infra/data/database/entities/UserEntity";



describe("POST /signin", () => {
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

    test("deve retornar 200 com o usuario encontrado no banco de dados", async () => {
        
    //passando um usuário existente no BD
        await request(server)
          .post(`/signin`)
          .send({
            name: "kaian",  
            pass: "123",
            
            
          })
          .expect(200)
          .expect(async (res) => {
            expect(res.body.uid).toBeTruthy();
            expect(res.body.name).toBeTruthy();
            
    
          });
      });


      test("deve retornar 500 com erro", async () => {
        
        //passando um usuário existente com senha incorreta no BD
            await request(server)
              .post(`/signin`)
              .send({
                name: "kaian",  
                pass: "12",
                
                
              })
              
              .expect(500, { error: "Internal Server Error", message: "Login or password not valid" });
          });
    

          test("deve retornar 500 com erro 2" , async () => {
        
            //passando um usuário inexistente no BD
                await request(server)
                  .post(`/signin`)
                  .send({
                    name: "kaian321",  
                    pass: "123",
                    
                    
                  })
                  
                  .expect(500, { error: "Internal Server Error", message: "User not valid" });
              });
              

test("Deve retornar 500 com Internal Server Error", async () => {
    jest
      .spyOn(UserRepository.prototype, "getUserByLogin")
      .mockRejectedValue(new Error("any_error"));

      await request(server)
      .post("/signin")
      .send()
      .expect(500, { error: "Internal Server Error", message: "any_error" });
  });



});