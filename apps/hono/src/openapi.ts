import { generateOpenApiDocument } from "trpc-to-openapi";

import { appRouter } from "@repo/api/router";

// Generate OpenAPI schema document
// @ts-ignore -
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "tRPC OpenAPI",
  version: "0.0.0",
  baseUrl: "http://localhost:8000/api",
  docsUrl: "http://localhost:8000/api/openapi.json",
});
