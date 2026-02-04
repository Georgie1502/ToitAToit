const createSpec = (req) => {
  const serverUrl = `${req.protocol}://${req.get("host")}`;

  return {
    openapi: "3.0.3",
    info: {
      title: "Users Service API",
      version: "1.0.0",
      description: "Auth, users, profiles, and preferences.",
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
            service: { type: "string", example: "users-service" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        UserStatus: {
          type: "string",
          enum: ["ACTIVE", "SUSPENDED", "DELETED"],
        },
        Gender: {
          type: "string",
          enum: ["F", "M", "NON_BINARY", "OTHER"],
        },
        OccupationStatus: {
          type: "string",
          enum: ["STUDENT", "PRO", "OTHER"],
        },
        SmokingPreference: {
          type: "string",
          enum: ["NO", "YES", "OUTSIDE_ONLY"],
        },
        PetsPreference: {
          type: "string",
          enum: ["NO", "YES", "OK_WITH_PETS"],
        },
        NoiseLevelPreference: {
          type: "string",
          enum: ["CALM", "NORMAL", "FESTIVE"],
        },
        GuestsPolicyPreference: {
          type: "string",
          enum: ["NO", "OCCASIONAL", "OK"],
        },
        UserPublic: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            username: { type: "string" },
            email: { type: "string" },
            status: { $ref: "#/components/schemas/UserStatus" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string" },
            email: { type: "string", example: "user@test.com" },
            password: { type: "string" },
          },
          example: {
            username: "alice",
            email: "alice@test.com",
            password: "Password123",
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
          example: {
            email: "alice@test.com",
            password: "Password123",
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            user: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                username: { type: "string" },
                email: { type: "string" },
              },
              required: ["id", "username", "email"],
            },
            token: { type: "string" },
          },
          required: ["user", "token"],
        },
        LogoutResponse: {
          type: "object",
          properties: { message: { type: "string" } },
        },
        ProfileUpsertRequest: {
          type: "object",
          properties: {
            birth_date: { type: "string", format: "date", nullable: true },
            gender: { allOf: [{ $ref: "#/components/schemas/Gender" }], nullable: true },
            occupation_status: {
              allOf: [{ $ref: "#/components/schemas/OccupationStatus" }],
              nullable: true,
            },
            bio: { type: "string", nullable: true },
          },
          example: {
            birth_date: "1999-01-31",
            gender: "F",
            occupation_status: "STUDENT",
            bio: "Je cherche une colocation sympa.",
          },
        },
        ProfileRow: {
          type: "object",
          properties: {
            user_id: { type: "string", format: "uuid" },
            birth_date: { type: "string", format: "date", nullable: true },
            gender: { allOf: [{ $ref: "#/components/schemas/Gender" }], nullable: true },
            occupation_status: {
              allOf: [{ $ref: "#/components/schemas/OccupationStatus" }],
              nullable: true,
            },
            bio: { type: "string", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        PreferencesUpsertRequest: {
          type: "object",
          properties: {
            budget_min: { type: "integer", nullable: true, minimum: 0 },
            budget_max: { type: "integer", nullable: true, minimum: 0 },
            location: { type: "string", nullable: true },
            smoking: {
              allOf: [{ $ref: "#/components/schemas/SmokingPreference" }],
              nullable: true,
            },
            pets: { allOf: [{ $ref: "#/components/schemas/PetsPreference" }], nullable: true },
            noise_level: {
              allOf: [{ $ref: "#/components/schemas/NoiseLevelPreference" }],
              nullable: true,
            },
            guests_policy: {
              allOf: [{ $ref: "#/components/schemas/GuestsPolicyPreference" }],
              nullable: true,
            },
            lifestyle_notes: { type: "string", nullable: true },
          },
          example: {
            budget_min: 400,
            budget_max: 750,
            location: "Paris",
            smoking: "NO",
            pets: "OK_WITH_PETS",
            noise_level: "NORMAL",
            guests_policy: "OCCASIONAL",
            lifestyle_notes: "Plutot calme en semaine.",
          },
        },
        PreferencesRow: {
          type: "object",
          properties: {
            user_id: { type: "string", format: "uuid" },
            budget_min: { type: "integer", nullable: true },
            budget_max: { type: "integer", nullable: true },
            location: { type: "string", nullable: true },
            smoking: { allOf: [{ $ref: "#/components/schemas/SmokingPreference" }], nullable: true },
            pets: { allOf: [{ $ref: "#/components/schemas/PetsPreference" }], nullable: true },
            noise_level: {
              allOf: [{ $ref: "#/components/schemas/NoiseLevelPreference" }],
              nullable: true,
            },
            guests_policy: {
              allOf: [{ $ref: "#/components/schemas/GuestsPolicyPreference" }],
              nullable: true,
            },
            lifestyle_notes: { type: "string", nullable: true },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        MyProfileResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/UserPublic" },
            profile: { allOf: [{ $ref: "#/components/schemas/ProfileRow" }], nullable: true },
            preferences: { allOf: [{ $ref: "#/components/schemas/PreferencesRow" }], nullable: true },
          },
        },
        UsersListResponse: {
          type: "object",
          properties: {
            users: { type: "array", items: { $ref: "#/components/schemas/UserPublic" } },
            limit: { type: "integer" },
            offset: { type: "integer" },
          },
        },
        GetUserResponse: {
          type: "object",
          properties: { user: { $ref: "#/components/schemas/UserPublic" } },
        },
        BatchUsersRequest: {
          type: "object",
          required: ["ids"],
          properties: {
            ids: { type: "array", items: { type: "string", format: "uuid" }, minItems: 1, maxItems: 200 },
          },
          example: { ids: ["b2b7a5b8-9b10-4c27-9f34-b8c0b2e0a111"] },
        },
        BatchUsersResponse: {
          type: "object",
          properties: { users: { type: "array", items: { $ref: "#/components/schemas/UserPublic" } } },
        },
        PreferencesResponse: {
          type: "object",
          properties: { preferences: { allOf: [{ $ref: "#/components/schemas/PreferencesRow" }], nullable: true } },
        },
        ProfileUpsertResponse: {
          type: "object",
          properties: { profile: { $ref: "#/components/schemas/ProfileRow" } },
        },
      },
    },
    tags: [
      { name: "Health" },
      { name: "Auth" },
      { name: "Users" },
      { name: "Profile" },
      { name: "Preferences" },
    ],
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/HealthResponse" },
                },
              },
            },
          },
        },
      },
      "/api/auth/signup": {
        post: {
          tags: ["Auth"],
          summary: "Signup",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupRequest" },
              },
            },
          },
          responses: {
            201: {
              description: "Created",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
              },
            },
            400: {
              description: "Bad request",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            409: {
              description: "Conflict",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          summary: "Login",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } },
              },
            },
            400: {
              description: "Bad request",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/auth/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout",
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/LogoutResponse" } },
              },
            },
          },
        },
      },
      "/users/profile": {
        get: {
          tags: ["Profile"],
          summary: "Get my profile (user + profile + preferences)",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/MyProfileResponse" } },
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
        put: {
          tags: ["Profile"],
          summary: "Upsert my profile",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ProfileUpsertRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/ProfileUpsertResponse" } },
              },
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
      "/users/batch": {
        post: {
          tags: ["Users"],
          summary: "Batch users by ids (avoid N+1)",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BatchUsersRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/BatchUsersResponse" } },
              },
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
      "/users": {
        get: {
          tags: ["Users"],
          summary: "List users",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "limit",
              in: "query",
              schema: { type: "integer", default: 50 },
            },
            { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/UsersListResponse" } },
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
      },
      "/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by id",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/GetUserResponse" } } },
            },
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["Users"],
          summary: "Update my username",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["username"],
                  properties: { username: { type: "string" } },
                },
                example: { username: "new_username" },
              },
            },
          },
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/GetUserResponse" } } },
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
            409: {
              description: "Conflict",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Users"],
          summary: "Soft-delete my user",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/GetUserResponse" } } },
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
      "/api/preferences": {
        get: {
          tags: ["Preferences"],
          summary: "Get my preferences",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/PreferencesResponse" } },
              },
            },
          },
        },
        post: {
          tags: ["Preferences"],
          summary: "Upsert my preferences",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PreferencesUpsertRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "OK",
              content: {
                "application/json": { schema: { $ref: "#/components/schemas/PreferencesResponse" } },
              },
            },
            400: {
              description: "Bad request",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Preferences"],
          summary: "Delete my preferences",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/LogoutResponse" } } },
            },
          },
        },
      },
    },
  };
};

module.exports = createSpec;
