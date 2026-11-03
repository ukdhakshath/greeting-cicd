export async function handler(event) {
  const path = event.rawPath;
  const method = event.requestContext?.http?.method;

  const environment = process.env.APP_ENV || "local";

  if (method !== "GET") {
    return response(405, { message: "Method not allowed" });
  }

  if (path === "/api/health") {
    return response(200, {
      message: "Backend is working",
      environment,
    });
  }

  if (path === "/api/greet") {
    const name = event.queryStringParameters?.name?.trim();

    if (!name || name.length > 50) {
      return response(400, {
        message: "Enter a name between 1 and 50 characters.",
      });
    }

    return response(200, {
      message: `Hello, ${name}!`,
      environment,
    });
  }

  return response(404, { message: "Endpoint not found" });
}

function response(statusCode, data) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}