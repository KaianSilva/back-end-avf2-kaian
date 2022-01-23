import { Request, Response } from "express";
import { Controller } from "../../../../core/presentation/contracts/controller";
import { ok, serverError } from "../../../../core/presentation/helpers/http-helper";
import { MessageRepository } from "../../infra/repositories/message.repository";


export class GetOneMessageController implements Controller {
    async handle(req: Request, res: Response): Promise<any> {
      console.log(
        "lógica para buscar um projeto por um identificador (uid) acessando o repositório"
      );
      try {
        const { uid } = req.params;
        console.log(uid)
        
        //  buscado na base dados
        const repository = new MessageRepository();
        const message = await repository.view(uid);
        console.log(message)
        /* if (!message) return res.status(404).json({ error: "Data not found" });
   */
        
  
        return ok(res, message);
      } catch (error: any) {
        return serverError(res, error);
      }
    }
  }