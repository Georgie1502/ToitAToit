const createSpec = (req) => {
  const serverUrl = `${req.protocol}://${req.get("host")}`;

  return {
    openapi: "3.0.3",
    info: {
      title: "Colocations Service API",
      version: "1.0.0",
      description: "Listings, favorites, applications, and matches.",
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
            service: { type: "string", example: "colocations-service" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        MessageResponse: {
          type: "object",
          properties: { message: { type: "string" } },
        },
        ListingStatus: {
          type: "string",
          enum: ["DRAFT", "PUBLISHED", "PAUSED", "CLOSED"],
        },
        HousingType: {
          type: "string",
          enum: ["ROOM", "STUDIO", "FLAT", "HOUSE", "OTHER"],
        },
        ApplicationStatus: {
          type: "string",
          enum: ["SENT", "ACCEPTED", "REJECTED", "WITHDRAWN"],
        },
        MatchStatus: {
          type: "string",
          enum: ["SUGGESTED", "LIKED", "DISLIKED", "MUTUAL"],
        },
        LocationInput: {
          type: "object",
          required: ["city", "postal_code"],
          properties: {
            city: { type: "string" },
            postal_code: { type: "string" },
            address: { type: "string", nullable: true },
            lat: { type: "number", nullable: true },
            lng: { type: "number", nullable: true },
          },
        },
        ListingCreateRequest: {
          type: "object",
          required: [
            "title",
            "description",
            "rent_amount",
            "housing_type",
            "available_from",
            "location",
          ],
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            rent_amount: { type: "integer", minimum: 0 },
            charges_included: { type: "boolean" },
            surface_m2: { type: "integer", nullable: true },
            housing_type: { $ref: "#/components/schemas/HousingType" },
            available_from: { type: "string", format: "date" },
            available_to: { type: "string", format: "date", nullable: true },
            min_duration_months: { type: "integer", nullable: true, minimum: 0 },
            status: { $ref: "#/components/schemas/ListingStatus" },
            location: { $ref: "#/components/schemas/LocationInput" },
          },
          example: {
            title: "Chambre dispo",
            description: "Proche metro",
            rent_amount: 650,
            charges_included: true,
            surface_m2: 12,
            housing_type: "ROOM",
            available_from: "2026-03-01",
            status: "PUBLISHED",
            location: { city: "Paris", postal_code: "75011" },
          },
        },
        ListingUpdateRequest: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            rent_amount: { type: "integer", minimum: 0 },
            charges_included: { type: "boolean" },
            surface_m2: { type: "integer", nullable: true },
            housing_type: { $ref: "#/components/schemas/HousingType" },
            available_from: { type: "string", format: "date" },
            available_to: { type: "string", format: "date", nullable: true },
            min_duration_months: { type: "integer", nullable: true, minimum: 0 },
            status: { $ref: "#/components/schemas/ListingStatus" },
          },
          example: { status: "PAUSED" },
        },
        ListingRow: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            owner_user_id: { type: "string", format: "uuid" },
            location_id: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string" },
            rent_amount: { type: "integer" },
            charges_included: { type: "boolean" },
            surface_m2: { type: "integer", nullable: true },
            housing_type: { $ref: "#/components/schemas/HousingType" },
            available_from: { type: "string", format: "date" },
            available_to: { type: "string", format: "date", nullable: true },
            min_duration_months: { type: "integer", nullable: true },
            status: { $ref: "#/components/schemas/ListingStatus" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        ListingWithLocation: {
          allOf: [
            { $ref: "#/components/schemas/ListingRow" },
            {
              type: "object",
              properties: {
                city: { type: "string" },
                postal_code: { type: "string" },
                address: { type: "string", nullable: true },
                lat: { type: "number", nullable: true },
                lng: { type: "number", nullable: true },
                photo_url: { type: "string", nullable: true },
              },
            },
          ],
        },
        ListingPhoto: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            url: { type: "string" },
            sort_order: { type: "integer" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        ListingsListResponse: {
          type: "object",
          properties: {
            listings: { type: "array", items: { $ref: "#/components/schemas/ListingWithLocation" } },
            limit: { type: "integer" },
            offset: { type: "integer" },
          },
        },
        ListingResponse: {
          type: "object",
          properties: { listing: { $ref: "#/components/schemas/ListingRow" } },
        },
        ListingDetailsResponse: {
          type: "object",
          properties: {
            listing: { $ref: "#/components/schemas/ListingWithLocation" },
            photos: { type: "array", items: { $ref: "#/components/schemas/ListingPhoto" } },
          },
        },
        FavoriteItem: {
          type: "object",
          properties: {
            favorited_at: { type: "string", format: "date-time" },
            listing_id: { type: "string", format: "uuid" },
            owner_user_id: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string" },
            rent_amount: { type: "integer" },
            charges_included: { type: "boolean" },
            surface_m2: { type: "integer", nullable: true },
            housing_type: { $ref: "#/components/schemas/HousingType" },
            available_from: { type: "string", format: "date" },
            available_to: { type: "string", format: "date", nullable: true },
            min_duration_months: { type: "integer", nullable: true },
            status: { $ref: "#/components/schemas/ListingStatus" },
            listing_created_at: { type: "string", format: "date-time" },
            listing_updated_at: { type: "string", format: "date-time" },
            location_id: { type: "string", format: "uuid" },
            city: { type: "string" },
            postal_code: { type: "string" },
            address: { type: "string", nullable: true },
            lat: { type: "number", nullable: true },
            lng: { type: "number", nullable: true },
          },
        },
        FavoritesListResponse: {
          type: "object",
          properties: {
            favorites: { type: "array", items: { $ref: "#/components/schemas/FavoriteItem" } },
            limit: { type: "integer" },
            offset: { type: "integer" },
          },
        },
        ApplicationCreateRequest: {
          type: "object",
          properties: { message: { type: "string", nullable: true } },
          example: { message: "Je suis interesse(e) !" },
        },
        ApplicationRow: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            listing_id: { type: "string", format: "uuid" },
            applicant_user_id: { type: "string", format: "uuid" },
            message: { type: "string", nullable: true },
            status: { $ref: "#/components/schemas/ApplicationStatus" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        MyApplicationItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            listing_id: { type: "string", format: "uuid" },
            applicant_user_id: { type: "string", format: "uuid" },
            message: { type: "string", nullable: true },
            status: { $ref: "#/components/schemas/ApplicationStatus" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            owner_user_id: { type: "string", format: "uuid" },
            title: { type: "string" },
            rent_amount: { type: "integer" },
            listing_status: { $ref: "#/components/schemas/ListingStatus" },
            city: { type: "string" },
            postal_code: { type: "string" },
          },
        },
        MyApplicationsResponse: {
          type: "object",
          properties: {
            applications: { type: "array", items: { $ref: "#/components/schemas/MyApplicationItem" } },
            limit: { type: "integer" },
            offset: { type: "integer" },
          },
        },
        ListingApplicationsResponse: {
          type: "object",
          properties: {
            listing_id: { type: "string", format: "uuid" },
            applications: { type: "array", items: { $ref: "#/components/schemas/ApplicationRow" } },
          },
        },
        ApplicationUpdateStatusRequest: {
          type: "object",
          required: ["status"],
          properties: { status: { $ref: "#/components/schemas/ApplicationStatus" } },
          example: { status: "ACCEPTED" },
        },
        ApplicationResponse: {
          type: "object",
          properties: { application: { $ref: "#/components/schemas/ApplicationRow" } },
        },
        MatchUpsertRequest: {
          type: "object",
          properties: {
            status: { $ref: "#/components/schemas/MatchStatus" },
            score: { type: "integer", nullable: true, minimum: 0 },
          },
          example: { status: "LIKED", score: 80 },
        },
        MatchRow: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            listing_id: { type: "string", format: "uuid" },
            user_id: { type: "string", format: "uuid" },
            score: { type: "integer", nullable: true },
            status: { $ref: "#/components/schemas/MatchStatus" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        MatchItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            listing_id: { type: "string", format: "uuid" },
            user_id: { type: "string", format: "uuid" },
            score: { type: "integer", nullable: true },
            status: { $ref: "#/components/schemas/MatchStatus" },
            created_at: { type: "string", format: "date-time" },
            owner_user_id: { type: "string", format: "uuid" },
            title: { type: "string" },
            rent_amount: { type: "integer" },
            listing_status: { $ref: "#/components/schemas/ListingStatus" },
            city: { type: "string" },
            postal_code: { type: "string" },
          },
        },
        MatchesListResponse: {
          type: "object",
          properties: {
            matches: { type: "array", items: { $ref: "#/components/schemas/MatchItem" } },
            limit: { type: "integer" },
            offset: { type: "integer" },
          },
        },
        MatchResponse: {
          type: "object",
          properties: { match: { allOf: [{ $ref: "#/components/schemas/MatchRow" }], nullable: true } },
        },
        MatchUpsertResponse: {
          type: "object",
          properties: { match: { $ref: "#/components/schemas/MatchRow" } },
        },
      },
    },
    tags: [
      { name: "Health" },
      { name: "Listings" },
      { name: "Favorites" },
      { name: "Applications" },
      { name: "Matches" },
    ],
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
      "/api/colocations": {
        get: {
          tags: ["Listings"],
          summary: "List listings",
          parameters: [
            { name: "status", in: "query", schema: { $ref: "#/components/schemas/ListingStatus" } },
            { name: "city", in: "query", schema: { type: "string" } },
            { name: "postal_code", in: "query", schema: { type: "string" } },
            { name: "min_rent", in: "query", schema: { type: "integer" } },
            { name: "max_rent", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
            { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ListingsListResponse" } } },
            },
          },
        },
        post: {
          tags: ["Listings"],
          summary: "Create listing",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/ListingCreateRequest" } } },
          },
          responses: {
            201: {
              description: "Created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ListingResponse" } } },
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
      "/api/colocations/search/location": {
        get: {
          tags: ["Listings"],
          summary: "Search by location (alias)",
          parameters: [
            { name: "status", in: "query", schema: { $ref: "#/components/schemas/ListingStatus" } },
            { name: "city", in: "query", schema: { type: "string" } },
            { name: "postal_code", in: "query", schema: { type: "string" } },
            { name: "min_rent", in: "query", schema: { type: "integer" } },
            { name: "max_rent", in: "query", schema: { type: "integer" } },
            { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
            { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ListingsListResponse" } } },
            },
          },
        },
      },
      "/api/colocations/{id}": {
        get: {
          tags: ["Listings"],
          summary: "Get listing by id",
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ListingDetailsResponse" } } },
            },
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        put: {
          tags: ["Listings"],
          summary: "Update listing (owner only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/ListingUpdateRequest" } } },
          },
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ListingResponse" } } },
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
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Listings"],
          summary: "Delete listing (owner only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            403: {
              description: "Forbidden",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/colocations/favorites": {
        get: {
          tags: ["Favorites"],
          summary: "List my favorites",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/FavoritesListResponse" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/colocations/{id}/favorites": {
        post: {
          tags: ["Favorites"],
          summary: "Add favorite",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            201: {
              description: "Created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Favorites"],
          summary: "Remove favorite",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/colocations/applications": {
        get: {
          tags: ["Applications"],
          summary: "List my applications",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MyApplicationsResponse" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/colocations/{id}/applications": {
        post: {
          tags: ["Applications"],
          summary: "Apply to listing",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: {
            required: false,
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApplicationCreateRequest" } } },
          },
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApplicationResponse" } } },
            },
            201: {
              description: "Created",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApplicationResponse" } } },
            },
            400: {
              description: "Bad request",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            409: {
              description: "Conflict",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        get: {
          tags: ["Applications"],
          summary: "List applications for listing (owner only)",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ListingApplicationsResponse" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            403: {
              description: "Forbidden",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/colocations/applications/{applicationId}": {
        patch: {
          tags: ["Applications"],
          summary: "Update application status",
          description:
            "Applicant can only WITHDRAWN (from SENT). Owner can ACCEPTED/REJECTED (from SENT).",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "applicationId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/ApplicationUpdateStatusRequest" } } },
          },
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/ApplicationResponse" } } },
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
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/colocations/matches": {
        get: {
          tags: ["Matches"],
          summary: "List my matches",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MatchesListResponse" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
      "/api/colocations/{id}/matches": {
        get: {
          tags: ["Matches"],
          summary: "Get my match for listing",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MatchResponse" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        post: {
          tags: ["Matches"],
          summary: "Upsert my match for listing",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { $ref: "#/components/schemas/MatchUpsertRequest" } } },
          },
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MatchUpsertResponse" } } },
            },
            400: {
              description: "Bad request",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
            404: {
              description: "Not found",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
        delete: {
          tags: ["Matches"],
          summary: "Delete my match for listing",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: {
              description: "OK",
              content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } },
            },
            401: {
              description: "Unauthorized",
              content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
            },
          },
        },
      },
    },
  };
};

module.exports = createSpec;

