import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";

import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { Message } from "../../domain/models/message";
import { MessageRepository } from "../../infra/repositories/message.repository";

export class GetAllMessageController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log("lógica para buscar todos as mensagens acessando o repositório");
    try {
      
      // cria uma instância do repositório do cache
      const cache = new CacheRepository();

      // busca os registro no cache
      const messagesCache = await cache.get("Kaian");

      // verifica se tem registro, caso verdadeiro, retorna do cache
      if (messagesCache) {
        return ok(
          res,
          (messagesCache as Message[]).map((message) =>
            Object.assign({}, message, { _cache: true })
          )
        );
      }
      

      const repository = new MessageRepository();

      const messages = await repository.getAll();

     /*  if (messages.length === 0) return notFound(res); */

      // salva no redis para servir de cache
      await cache.set("Kaian_DB_Redis", messages);

      return ok(res, messages);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
