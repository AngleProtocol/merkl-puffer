import type { ClientLoaderFunction, ClientLoaderFunctionArgs } from "@remix-run/react";
import chalk from "chalk";
import NodeCache from "node-cache";

export class CacheService {
  cache = new NodeCache();

  set<T>(key: string, ttl: number, value: T) {
    this.cache.set(key, value, ttl);

    process.env.NODE_ENV === "development" && chalk.cyan(`[CACHE]: ${key}`);

    return value;
  }

  get<T>(key: string): T | undefined {
    const cached = this.cache.get<T>(key);
    chalk.green(`[CACHED]: ${key}`);
    process.env.NODE_ENV === "development" && chalk.green(`[CACHED]: ${key}`);

    return cached;
  }

  reset(key: string) {
    this.cache.del(key);
  }

  wrap(resource: string, ttl: number): ClientLoaderFunction {
    return async ({ request, serverLoader }: ClientLoaderFunctionArgs) => {
      const key = `${resource}:${request.url}`;
      const cache = Cache.get(key);

      console.log("AAAAAAAA", request.url, cache);
      if (cache) return cache;

      const data = await serverLoader();
      console.log("AAAAAA =>", data);

      Cache.set(key, ttl, data);

      console.log("value", data);

      return data;
    };
  }
}

export const Cache = new CacheService();
