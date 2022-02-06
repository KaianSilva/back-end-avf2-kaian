import { Request, Response } from "express";
import { CacheRepository } from "../../../../core/infra/repositories/cache.repository";
import { Controller } from "../../../../core/presentation/contracts/controller";
import { ok, serverError } from "../../../../core/presentation/helpers/http-helper";
import { Message } from "../../domain/models/message";
import { MessageRepository } from "../../infra/repositories/message.repository";


export class GetOneMessageController implements Controller {
    async handle(req: Request, res: Response): Promise<any> {
      console.log(
        "lógica para buscar um projeto por um identificador (uid) acessando o repositório"
      );
      try {
        const { uid } = req.params;
        console.log(uid)

        // cria uma instância do repositorio que cuida do cache
        const cache = new CacheRepository();

        // recupera o registro no cache
        const messageCache: Message = await cache.get(`Kaian_Redis_message:${uid}`);

        // verifica se encontrou e retorna caso verdadeiro
        if (messageCache) {
        return ok(res, Object.assign({}, messageCache, { _cache: true }));
      }
        
        // se não encontrou no cache busca na base dados
        const repository = new MessageRepository();
        const message = await repository.getByUid(uid);
        console.log(message)

        if (!message) return res.status(404).json({ error: "Data not found" });
   
        // salva no redis para o dado ficar cacheado
        await cache.set(`Kaian_Redis_message:${message.uid}`, message);
  
        return ok(res, message);
      } catch (error: any) {
        return serverError(res, error);
      }
    }
  }