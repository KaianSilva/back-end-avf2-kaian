import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";

import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { MessageRepository } from "../../infra/repositories/message.repository";


export class UpdateMessageController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log("lógica para atualizar uma mensagem acessando o repositório");
    try {
      const { uid } = req.params;
        console.log(uid)
      const repository = new MessageRepository();

      const message = await repository.editMessage({ uid, ...req.body });
      if(!message) return res.status(404).send("mensagem ou usuário não encontrada");

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
