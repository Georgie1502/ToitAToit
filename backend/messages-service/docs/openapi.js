const createSpec = (req) => {
  const serverUrl = `${req.protocol}://${req.get("host")}`;

  return {
    openapi: "3.0.3",
    info: {
      title: "Messages Service API",
      version: "1.0.0",
      description: "Conversations and messages.",
    },
    servers: [{ url: serverUrl }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: { message: { type: "string" } },
        },
        HealthResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "healthy" },
            service: { type: "string", example: "messages-service" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        MessageRow: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            conversation_id: { type: "string", format: "uuid" },
            sender_user_id: { type: "string", format: "uuid" },
            body: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            read_at: { type: "string", format: "date-time", nullable: true },
          },
        },
        ConversationSummary: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            listing_id: { type: "string", format: "uuid", nullable: true },
            created_at: { type: "string", format: "date-time" },
            participant_user_ids: { type: "array", items: { type: "string", format: "uuid" } },
            last_body: { type: "string", nullable: true },
            last_created_at: { type: "string", format: "date-time", nullable: true },
            last_sender_user_id: { type: "string", format: "uuid", nullable: true },
          },
        },
        ConversationsListResponse: {
          type: "object",
          properties: {
            conversations: { type: "array", items: { $ref: "#/components/schemas/ConversationSummary" } },
            limit: { type: "integer" },
            offset: { type: "integer" },
          },
        },
        MessagesListResponse: {
          type: "object",
          properties: {
            conversation_id: { type: "string", format: "uuid" },
            messages: { type: "array", items: { $ref: "#/components/schemas/MessageRow" } },
            limit: { type: "integer" },
            offset: { type: "integer" },
          },
        },
        SendMessageToConversationRequest: {
          type: "object",
          required: ["body", "conversation_id"],
          properties: {
            body: { type: "string" },
            conversation_id: { type: "string", format: "uuid" },
          },
          example: {
            body: "Salut, toujours dispo ?",
            conversation_id: "b2b7a5b8-9b10-4c27-9f34-b8c0b2e0a111",
          },
        },
        SendMessageNewConversationRequest: {
          type: "object",
          required: ["body", "recipient_user_id"],
          properties: {
            body: { type: "string" },
            recipient_user_id: { type: "string", format: "uuid" },
            listing_id: { type: "string", format: "uuid", nullable: true },
          },
          example: {
            body: "Salut, dispo pour une visite ?",
            recipient_user_id: "a1a1a1a1-1111-4111-8111-111111111111",
            listing_id: "c2c2c2c2-2222-4222-8222-222222222222",
          },
        },
        SendMessageRequest: {
          oneOf: [
            { $ref: "#/components/schemas/SendMessageToConversationRequest" },
            { $ref: "#/components/schemas/SendMessageNewConversationRequest" },
          ],
          description:
            "Either provide conversation_id OR recipient_user_id (to create a new conversation). listing_id is optional.",
        },
        SendMessageResponse: {
          type: "object",
          properties: { message: { $ref: "#/components/schemas/MessageRow" } },
        },
        GetMessageResponse: {
          type: "object",
          properties: { message: { $ref: "#/components/schemas/MessageRow" } },
        },
      },
    },
    tags: [{ name: "Health" }, { name: "Messages" }],
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/HealthResponse" } } },
            },
          },
        },
      },
      "/api/messages": {
        get: {
          tags: ["Messages"],
          summary:
            "List conversations (default) or messages of a conversation if conversation_id is provided",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "conversation_id", in: "query", schema: { type: "string", format: "uuid" } },
            { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
            { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: {
                    oneOf: [
                      { $ref: "#/components/schemas/ConversationsListResponse" },
                      { $ref: "#/components/schemas/MessagesListResponse" },
                    ],
                  },
                  examples: {
                    conversations: {
                      summary: "Conversation list",
                      value: { conversations: [], limit: 50, offset: 0 },
                    },
                    messages: {
                      summary: "Messages of one conversation",
                      value: {
                        conversation_id: "b2b7a5b8-9b10-4c27-9f34-b8c0b2e0a111",
                        messages: [],
                        limit: 50,
                        offset: 0,
                      },
                    },
                  },
                },
              },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            403: {
              description: "Forbidden",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        post: {
          tags: ["Messages"],
          summary: "Send message (and optionally create conversation)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/SendMessageRequest" } } },
          },
          responses: {
            201: {
              description: "Created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/SendMessageResponse" } } },
            },
            400: {
              description: "Bad request",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            403: {
              description: "Forbidden",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/messages/{id}": {
        get: {
          tags: ["Messages"],
          summary: "Get message by id (only if participant)",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/GetMessageResponse" } } },
            },
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            403: {
              description: "Forbidden",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
    },
  };
};

module.exports = createSpec;

