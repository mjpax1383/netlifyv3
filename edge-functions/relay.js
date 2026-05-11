export default async (request, context) => {
  // Read secrets from environment variables (set in Netlify UI)
  const RELAY_KEY = Deno.env.get("RELAY_KEY");
  const TARGET_HOST = Deno.env.get("TARGET_HOST");

  // 1. Validate the relay key
  const clientKey = request.headers.get("x-relay-key");
  if (!clientKey || clientKey !== RELAY_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 2. Build the target URL, keeping the original path and query string
  const url = new URL(request.url);
  const targetUrl = `${TARGET_HOST}${url.pathname}${url.search}`;

  // 3. Rewrite the request on the edge – the response is streamed directly
  return context.rewrite(targetUrl);
};
