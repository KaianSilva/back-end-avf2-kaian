import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";

import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { MessageRepository } from "../../infra/repositories/message.repository";


export class DeleteMessageController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log("lógica para atualizar um projeto acessando o repositório");
    try {
      const { uid } = req.params;
        console.log(uid)
      const repository = new MessageRepository();
    
      
      const message = await repository.deleteMessage(uid);

      if(!message) return res.status(404).send("Mensagem não encontrada");

      const cache = new CacheRepository();
      
      //exclui lista de msgs do user  no cache
      await cache.delete(`Kaian:messages:user:${message.user}`);

      // exclui o uid da mensagem
      await cache.delete(`Kaian:message:${uid}`);
      
      
      return ok(res, message);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
