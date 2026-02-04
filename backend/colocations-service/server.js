const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const colocationsRoutes = require("./routes/colocations");
const createOpenApiSpec = require("./docs/openapi");

const app = express();
const PORT = process.env.PORT || 3002;
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || process.env.FRONTEND_URL || "http://localhost:3004";

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "colocations-service",
    timestamp: new Date().toISOString(),
  });
});

// OpenAPI / Swagger UI
app.get("/openapi.json", (req, res) => res.json(createOpenApiSpec(req)));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(null, { swaggerOptions: { url: "/openapi.json" } }),
);

app.use("/api/colocations", colocationsRoutes);

app.listen(PORT, () => {
  console.log(`colocations-service listening on port ${PORT}`);
});
