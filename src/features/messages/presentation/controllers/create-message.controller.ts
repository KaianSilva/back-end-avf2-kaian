import console from "console";
import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import { Controller } from "../../../../core/presentation/contracts/controller";
import {
    serverError,
    ok,
    badRequest,
  } from "../../../../core/presentation/helpers/http-helper";

import { MessageRepository } from "../../infra/repositories/message.repository";


export class CreateMessageController implements Controller {
    async handle(req: Request, res: Response): Promise<any> {
      
      

        
      try {
        const repository = new MessageRepository();
        const cache = new CacheRepository();

        const message = await repository.create(req.body); 

        console.log(message)
        if(!message) return res.status(404).json({ error: "Usuário não encontrado" });
        
        // salvar  no cache (redis)
        const result = await cache.set(`Kaian:message:${message.uid}`, message);

        if (!result) console.log("NÃO SALVOU NO CACHE");

        // limpa a lista de registros do redis, pois o cache está desatualizado neste momento
        await cache.delete(`Kaian:messages:user:${message.user}`);
        

        

         return ok(res, message); 
      } catch (error: any) {
        return serverError(res, error);
      }
    }
  }
  