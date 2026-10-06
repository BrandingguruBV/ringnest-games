const API = "https://discord.com/api/v10";

export type DiscordObject = {
  id: string;
  name?: string;
  type?: number;
  parent_id?: string | null;
  position?: number;
  topic?: string | null;
  [key: string]: unknown;
};

export class DiscordApi {
  private token: string;
  constructor(token: string) {
    this.token = token;
  }

  async request<T>(method: string, path: string, body?: unknown, extra: RequestInit = {}): Promise<T> {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const headers: Record<string, string> = {
        Authorization: `Bot ${this.token}`,
        "User-Agent": "DiscordBot (https://ringnest.games, 1.0)",
        "X-Audit-Log-Reason": "Ringnest studio Discord setup",
        ...(extra.headers as Record<string, string> | undefined),
      };
      let payload: BodyInit | undefined;
      if (body !== undefined) {
        if (typeof FormData !== "undefined" && body instanceof FormData) {
          payload = body;
        } else {
          headers["Content-Type"] = "application/json";
          payload = JSON.stringify(body);
        }
      }
      const res = await fetch(`${API}${path}`, { method, headers, body: payload });
      if (res.status === 204) {
        return undefined as T;
      }
      if (res.status === 429) {
        const data = (await res.json().catch(() => ({}))) as { retry_after?: number };
        await sleep(((data.retry_after ?? 1) + 0.2) * 1000);
        continue;
      }
      const text = await res.text();
      if (!res.ok) {
        throw new Error(`${method} ${path} ${res.status}: ${text.slice(0, 800)}`);
      }
      return text ? (JSON.parse(text) as T) : (undefined as T);
    }
    throw new Error(`${method} ${path} hit Discord rate limits`);
  }

  get<T>(path: string) {
    return this.request<T>("GET", path);
  }
  post<T>(path: string, body?: unknown) {
    return this.request<T>("POST", path, body);
  }
  patch<T>(path: string, body?: unknown) {
    return this.request<T>("PATCH", path, body);
  }
  put<T>(path: string, body?: unknown) {
    return this.request<T>("PUT", path, body);
  }
  del<T>(path: string) {
    return this.request<T>("DELETE", path);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
