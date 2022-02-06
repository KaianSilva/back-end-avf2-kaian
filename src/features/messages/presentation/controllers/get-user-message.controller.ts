import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import { Controller } from "../../../../core/presentation/contracts/controller";
import { ok, serverError } from "../../../../core/presentation/helpers/http-helper";
import { Message } from "../../domain/models/message";
import { MessageRepository } from "../../infra/repositories/message.repository";


export class GetUserMessageController implements Controller {
    async handle(req: Request, res: Response): Promise<any> {
      console.log(
        "lógica para buscar um mensages por um identificador (uid) user"
      );
      try {
        const { uid } = req.params;
        console.log(uid)

        
        
        //  buscado na base dados
        const repository = new MessageRepository();
        const message = await repository.getByUserUid(uid);
        
        /* if (!message) return res.status(404).json({ error: "Data not found" });
   */
        
        
        
  
        return ok(res, message);
      } catch (error: any) {
        return serverError(res, error);
      }
    }
  }