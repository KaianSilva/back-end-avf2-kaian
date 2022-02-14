import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import { Controller } from "../../../../core/presentation/contracts/controller";
import { ok, serverError } from "../../../../core/presentation/helpers/http-helper";
import { Message } from "../../domain/models/message";
import { MessageRepository } from "../../infra/repositories/message.repository";


export class GetUserMessageController implements Controller {
    async handle(req: Request, res: Response): Promise<any> {
      
      try {
        const { uid } = req.params;
        
        const cache = new CacheRepository();

        const messsagesCache = await cache.get(`Kaian:messages:user:${uid}`)

        if(messsagesCache){
          return ok(res, (messsagesCache as Message[]).map(message=> ({
            ...message,
             _cache: true,
            }))
          );
        }
        
        
        //  buscado na base dados
        const repository = new MessageRepository();
        const messages = await repository.getByUserUid(uid);
        
        await cache.set(`Kaian:messages:user:${uid}`, messages)
   
        
        
        
  
        return ok(res, messages);
      } catch (error: any) {
        return serverError(res, error);
      }
    }
  }