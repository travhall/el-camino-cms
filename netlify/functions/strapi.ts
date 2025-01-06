import { createStrapi } from "@strapi/strapi";
import type { Handler } from "@netlify/functions";

let strapi: any;

export const handler: Handler = async (event, context) => {
  if (!strapi) {
    strapi = await createStrapi().load();
    await strapi.server.mount();
  }

  const { httpMethod: method, rawUrl, body } = event;

  try {
    const response = await strapi.server.router.handleRequest({
      method,
      url: rawUrl,
      body: body ? JSON.parse(body) : undefined,
      headers: event.headers,
    });

    return {
      statusCode: response.status,
      headers: response.headers,
      body: JSON.stringify(response.body),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
