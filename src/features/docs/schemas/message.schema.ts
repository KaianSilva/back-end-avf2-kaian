export const messageSchema = {
  type: "object",
  properties: {

    user: {
      type: "string",
      summary: "UUid do usuário",
      example: "f1b5960c-5690-4191-ab1c-e215fc812715",
    },

    title: {
      type: "string",
      summary: "titulo da mensagem",
      example: "mensagem 1",
    },
    description: {
      type: "string",
      summary: "descrição da mensagem",
      example: 'teste de mensagem',
    },
    
  },
};
