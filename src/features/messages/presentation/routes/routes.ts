import { Router } from "express";
import { CreateMessageController } from "../controllers/create-message.controller";
import { DeleteMessageController } from "../controllers/delete-message.controller";
import { GetAllMessageController } from "../controllers/get-all-message.controller";
import { GetOneMessageController } from "../controllers/get-one-message.controller";
import { UpdateMessageController } from "../controllers/update-message.controller";



export default class MessageRoutes {
  public init(): Router {
    const routes = Router();

    routes.post("/message", new CreateMessageController().handle);
    routes.get("/message",new GetAllMessageController().handle)
    routes.put("/message/:uid", new UpdateMessageController().handle)
    routes.get("/message/:uid", new GetOneMessageController().handle)
    routes.delete("/message/:uid", new DeleteMessageController().handle)
    return routes;
  }
}
