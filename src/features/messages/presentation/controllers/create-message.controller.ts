import console from "console";
import { Request, Response } from "express";
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
        console.log('controller')
        // salvar o project na base dados
        const message = await repository.create(req.body); 
        
        console.log(message)
        if(!message) return res.status(404).send("Usuário não encontrado");

         return ok(res, message); 
      } catch (error: any) {
        return serverError(res, error);
      }
    }
  }
  