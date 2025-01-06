import { createStrapi } from "@strapi/strapi";
import type { Handler } from "@netlify/functions";

let strapi: any;

export const handler: Handler = async (event) => {
  try {
    if (!strapi) {
      console.log("Initializing Strapi...");
      strapi = await createStrapi().load();
      await strapi.server.mount();
      console.log("Strapi initialized successfully");
    }

    const { httpMethod, path } = event;
    console.log(`Handling ${httpMethod} request to ${path}`);

    const response = await strapi.server.router.handleRequest({
      method: event.httpMethod,
      url: event.rawUrl,
      body: event.body ? JSON.parse(event.body) : undefined,
      headers: event.headers,
    });

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        ...response.headers,
      },
      body: JSON.stringify(response.body),
    };
  } catch (error) {
    console.error("Strapi handler error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
        path: event.path,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
