export const messagesPath = {
  tags: ["Messages"],
  security: [
    {
      Bearer: [],
    },
  ],
  summary: "Informações das mensagens",
  parameters: [],
  responses: {
    200: {
      description: "Sucesso",
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/message",
          },
        },
      },
    },
    401: {
      $ref: "#/components/responses/NaoAutorizado",
    },
  },
};

// Documenta o GET para umaa mensagem pelo ID
// /messages/:id
export const getMessagePath = {
  tags: ["Messages"],
  summary: "Informações de uma mensagem",
  title: "Informações de uma mensagem pelo ID",
  description: "Informações adicionais da rota",
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID do mensagem",
      required: true,
      schema: {
        type: "string",
        format: "uuid",
      },
    },
  ],
  responses: {
    200: {
      description: "Sucesso",
      content: {
        "application/json": {
          schema: {
            $ref: "#/schemas/message",
          },
        },
      },
    },
    404: {
      description: "Mensagem  não encontrada",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

export const postMessagePath = {
  tags: ["Messages"],
  summary: "Incluir uma mensagem",
  title: "Incluir uma mensagem",
  description: "Informações adicionais da rota",
  parameters: [],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/schemas/message",
        },
      },
    },
  },
  responses: {
    201: {
      description: "Sucesso",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Incluido",
              },
            },
          },
        },
      },
    },
  },
};

export const putMessagePath = {
  tags: ["Messages"],
  summary: "Atualizar uma mensagem",
  title: "Atualizar uma mensagem",
  description: "Informações adicionais da rota",
  // vai entrar em desuso no futuro
  deprecated: true,
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID do mensagem",
      required: true,
      schema: {
        type: "string",
        format: "uuid",
      },
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: "#/schemas/message",
        },
      },
    },
  },
  responses: {
    200: {
      description: "Sucesso",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Alterada",
              },
            },
          },
        },
      },
    },

    404: {
      description: "Mensagem  não encontrada",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};

export const deleteMessagePath = {
  tags: ["Messages"],
  summary: "Excluir uma mensagem",
  title: "Excluir uma mensagem",
  description: "Informações adicionais da rota",
  parameters: [
    {
      name: "id",
      in: "path",
      description: "ID do mensagem",
      required: true,
      schema: {
        type: "string",
        format: "uuid",
      },
    },
  ],
  responses: {
    200: {
      description: "Sucesso",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                example: "Excluida",
              },
            },
          },
        },
      },
    },
    404: {
      description: "Mensagem  não encontrada",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
              },
            },
          },
        },
      },
    },
  },
};
