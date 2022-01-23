

import { MessageRepository } from "../../infra/repositories/message.repository";
import { Message } from "../models/message";


interface MessageParams {
    userUid: string;
    title: string;
    description: string;
}
/**
 * Este arquivo
 */
export class CreateMessage {
  // injeção de dependência
  
  repository: MessageRepository

  constructor(repository: MessageRepository) {
    this.repository = repository;
  }

  async execute(params: MessageParams): Promise<Message> {
    
    
    // salvar mensagem na base de dados
    const msgCreated = await this.repository.createMessage({
     title: params.title,
     description: params.description,
     user: params.userUid
});

    return msgCreated;
  }
}
