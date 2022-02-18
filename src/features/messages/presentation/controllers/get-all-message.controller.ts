import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";

import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
  badRequest
} from "../../../../core/presentation/helpers/http-helper";
import { Message } from "../../domain/models/message";
import { MessageRepository } from "../../infra/repositories/message.repository";

export class GetAllMessageController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    
    try {
      

      const repository = new MessageRepository();

      const messages = await repository.getAll();
      if(messages.length == 0) return  badRequest(res, "Usuário não encontrado");

      return ok(res, messages);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
