import { Request, Response } from "express";

import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { MessageRepository } from "../../infra/repositories/message.repository";

export class GetAllMessageController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log("lógica para buscar todos os projetos acessando o repositório");
    try {
      
      

      const repository = new MessageRepository();

      const messages = await repository.getAll();

     /*  if (messages.length === 0) return notFound(res); */

      

      return ok(res, messages);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
