const encoder = new TextEncoder();
const ascii = new TextDecoder('us-ascii');
const utf8 = new TextDecoder('utf-8');

type Options = {
  maxAgeMillis?: number;
};

type CachedResponse = RequestInit & {
  timestamp: number;
  body: string;
};

export async function fetchCached(
  endpoint: string,
  init?: RequestInit,
  {
    maxAgeMillis = 15 /* min */ * 60 /* sec */ * 1000 /* milliseconds */
  }: Options = {}
) {
  const key = await storageKey(endpoint, init);
  const { timestamp, body, ...responseInit } = key
    ? (JSON.parse(localStorage.getItem(key) || '{}') as CachedResponse)
    : {};
  if (timestamp && timestamp + maxAgeMillis > Date.now()) {
    return new Response(encoder.encode(body), responseInit);
  } else {
    if (key) {
      localStorage.removeItem(key);
    }
    const response = await fetch(endpoint, init);
    if (key === undefined || response.status !== 200) {
      return response;
    }
    const body = utf8.decode(await response.arrayBuffer());
    const { status, statusText } = response;
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        status,
        statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body
      } as CachedResponse)
    );
    return new Response(encoder.encode(body), response);
  }
}

async function storageKey(endpoint: string, init?: RequestInit) {
  const { method = 'GET' } = init || {};
  if (method.toUpperCase() === 'GET') {
    return `${method.toUpperCase()}:${endpoint}.${ascii.decode(await hash(init))}`;
  }
  return undefined;
}

async function hash(value: unknown, algorithm = 'SHA-1') {
  return await crypto.subtle.digest(
    algorithm,
    encoder.encode(JSON.stringify(value))
  );
}
