import { Request, response, Response } from "express";
import { ok } from "assert";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { MessageEntity } from "../../../../core/infra/data/database/entities/MessageEntity";
import { UserEntity } from "../../../../core/infra/data/database/entities/UserEntity";
import { UserRepository } from "../../../users/infra/repositories/user.repository";

import { Message } from "../../domain/models/message";


interface MessageParams {
    uid?: string;
    user: string;
    title: string;
    description: string;
}

export class MessageRepository{
    async getByUid(uid: string): Promise<Message | undefined> {
        console.log("vai consultar o banco para recuperar o registro pelo uid");
    
        const projectEntity = await MessageEntity.findOne({
          where: {
            uid: uid,
          },
        });
    
        if (!projectEntity) return undefined;
        
        console.log(projectEntity)
        return this.mapperFromEntityToModel(projectEntity);
      }

      async getByUserUid(uid: string): Promise<Message[]> {
        console.log("vai consultar o banco para recuperar o registro pelo uid do usuario");
        console.log(uid)
        const msgEntities = await MessageEntity.find({
          where: {
            user: uid,
          }
        });        
        console.log(msgEntities)
        return msgEntities.map((msgEntity) =>
          this.mapperFromEntityToModel(msgEntity)
        );
    
       
      }

       
        async getAll(): Promise<Message[]> {
            console.log("consultar o banco e recuperar todos os registros");
            const msgEntities = await MessageEntity.find();
            console.log(msgEntities)
            return msgEntities.map((msgEntity) =>
              this.mapperFromEntityToModel(msgEntity)
            );
          }



        async create(data: MessageParams): Promise<Message | undefined> {
            

             const user = await UserEntity.findOne(data.user);
             if(!user) return undefined;

            
            const msgEntity = MessageEntity.create({
              title: data.title,
              description: data.description,
              user: data.user             
            });
        
            // de falto salta as informações no banco de dados
            await msgEntity.save();
            
            // retorna as informações conforme o tipo de retorno do método.
            return this.mapperFromEntityToModel(msgEntity);
            
          }
          
          async editMessage(data: MessageParams) {
            const msgEntity = await MessageEntity.findOne(data.uid);
            
            if (!msgEntity) return undefined;
        
            const msgUpdated = MessageEntity.create({
                title: data.title,
                description: data.description,
                uid: data.uid,
            });
        
            await msgUpdated.save();
        
            return this.mapperFromEntityToModel(msgUpdated);
          }

          async deleteMessage(uid:string) {
            const msgEntity = await MessageEntity.findOne(uid);
            
            if (!msgEntity) return undefined;
            
            const msgDeleted = MessageEntity.remove(msgEntity);
        
            
        
            return (msgDeleted);
          }
        


          private mapperFromEntityToModel(entity: MessageEntity): Message {
            return {
              uid: entity.uid,
              title: entity.title,
              description: entity.description,
              user:entity.user
            };
          }

            
}