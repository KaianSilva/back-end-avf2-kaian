import express, { Response, Request } from "express";
import cors from "cors";
import setupSwagger from "../../config-swagger";
import UserRoutes from "../../features/users/presentation/routes/routes";
import MessageRoutes from "../../features/messages/presentation/routes/routes";
import authMiddleware from "../../features/users/presentation/middlewares/auth.middleware";
/**
 * Éssa é a classe que é responsável por configurar a aplicação e iniciar o servidor
 */
export default class App {
  // cria uma referência do express que é privada e não deixa ser sobescrita depois
  // que definido um valor, ou seja, ela é somente leitura.
  readonly #express: express.Express;

  // de fato, adiciona um valor a referência do express
  constructor() {
    this.#express = express();
  }

  public get server(): express.Application {
    return this.#express;
  }

  // inicia toda configuração da aplicação
  public init() {
    this.middlewares();
    this.routes();
  }

  // defini os middlewares default do servidor
  public middlewares() {
    this.#express.use(cors());
    this.#express.use(express.json());
  }

  // defini todas as rotas que a aplicação terá,
  // importando as rotas de cada feature.
  public routes() {
    this.#express.get("/", (req: Request, res: Response) =>
      res.status(200).send("ok")
    );

     // /doc
     setupSwagger(this.#express);

   
    const messageRoutes = new MessageRoutes().init();
    /* this.#express.use(messageRoutes); */

    const userRoutes = new UserRoutes().init();
    this.#express.use(userRoutes);

    // -> aplico o middleware
    //this.#express.use(authMiddleware);

    this.#express.use(messageRoutes);

  }

  // inicia o servidor express
  public start(port: string) {
    this.#express.listen(port, () => {
      console.log(`api running... ${port}`);
    });
  }
}
