import {
    deleteMessagePath,
    getMessagePath,
    postMessagePath,
    putMessagePath,
    messagesPath,
  } from "./docs/messages.path";
  import { messageSchema } from "./schemas/message.schema";
  
  export default {
    openapi: "3.0.3",
    info: {
      title: "Recados API",
      description: "Growdev sistema de recados API's documentation",
      version: "1.0.0",
      contact: {
        name: "Kaian",
        email: "kaian.f.silva@gmail.com",
        url: "",
      },
    },
    servers: [
      {
        url: "https://back-end-avf-kaian.herokuapp.com",
        description: "sys Recados Prod",
      },
      {
        url: "{protocol}://localhost:{port}",
        description: "sys Recados Homolog",
        variables: {
          protocol: {
            enum: ["http", "https"],
            default: "https",
          },
          port: {
            enum: ["3333", "443"],
            default: "3333",
          },
        },
      },
    ],
    tags: [
      {
        name: "Messages",
        description: "Mensagens do sistema de API",
      },
      {
        name: "Auth",
        descripton: "Rotas de autenticação",
      },
    ],
    paths: {
      "/message": {
        get: messagesPath,
        post: postMessagePath,
      },
      "/message/{id}": {
        get: getMessagePath,
        put: putMessagePath,
        delete: deleteMessagePath,
      },
    },
    schemas: {
      message: messageSchema,
    },
    components: {
      securitySchemes: {
        Bearer: {
          type: "http",
          scheme: "bearer",
          bearerformat: "JWT",
        },
      },
      security: [
        {
          Bearer: [],
        },
      ],
      responses: {
        NaoAutorizado: {
          description: "Não autorizado",
          content: {
            "application/json": {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "Token inválido",
                },
              },
            },
          },
        },
      },
    },
  };
  