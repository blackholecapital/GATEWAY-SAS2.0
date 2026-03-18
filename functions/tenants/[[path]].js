export async function onRequestGet({ env, params }) {
  const parts = params?.path || [];
  const key = Array.isArray(parts) ? parts.join("/") : String(parts || "");
  if (!key) return new Response("Not found", { status: 404 });

  const bucket = env.GATEWAY_TENANTS;
  if (!bucket || typeof bucket.get !== "function") {
    return new Response("R2 binding missing: expected GATEWAY_TENANTS", { status: 500 });
  }

  const obj = await bucket.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  const lower = key.toLowerCase();

  if (lower.endsWith(".json")) headers.set("content-type", "application/json; charset=utf-8");
  else if (lower.endsWith(".png")) headers.set("content-type", "image/png");
  else if (lower.endsWith(".ico")) headers.set("content-type", "image/x-icon");
  else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) headers.set("content-type", "image/jpeg");
  else if (lower.endsWith(".webp")) headers.set("content-type", "image/webp");
  else headers.set("content-type", "application/octet-stream");

  headers.set("cache-control", "public, max-age=300");
  headers.set("access-control-allow-origin", "*");

  return new Response(obj.body, { headers });
}
