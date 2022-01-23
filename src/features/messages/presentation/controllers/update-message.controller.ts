import { Request, Response } from "express";

import { Controller } from "../../../../core/presentation/contracts/controller";
import {
  notFound,
  ok,
  serverError,
} from "../../../../core/presentation/helpers/http-helper";
import { MessageRepository } from "../../infra/repositories/message.repository";


export class UpdateMessageController implements Controller {
  async handle(req: Request, res: Response): Promise<any> {
    console.log("lógica para atualizar um projeto acessando o repositório");
    try {
      const { uid } = req.params;
        console.log(uid)
      const repository = new MessageRepository();

      const message = await repository.editMessage({ uid, ...req.body });
      if(!message) return res.status(404).send("mensagem ou usuário não encontrada");

      return ok(res, message);
    } catch (error: any) {
      return serverError(res, error);
    }
  }
}
