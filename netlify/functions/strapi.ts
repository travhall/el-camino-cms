import { createStrapi } from "@strapi/strapi";

let strapi: any;

export async function handler(event: {
  httpMethod: string;
  rawUrl: string;
  body: string | null;
  headers: Record<string, string>;
}) {
  try {
    if (!strapi) {
      strapi = await createStrapi().load();
      await strapi.server.mount();
    }

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
        ...response.headers,
      },
      body: JSON.stringify(response.body),
    };
  } catch (error) {
    console.error("Strapi handler error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
}
