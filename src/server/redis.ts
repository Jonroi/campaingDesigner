import Redis from "ioredis";
import { env } from "~/env";

class RedisService {
  private client: Redis;
  private static instance: RedisService;

  private constructor() {
    this.client = new Redis(env.REDIS_URL, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.client.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    this.client.on("connect", () => {
      console.log("Connected to Redis");
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      console.error("Redis set error:", error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error("Redis del error:", error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error("Redis exists error:", error);
      return false;
    }
  }

  async flushdb(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      console.error("Redis flushdb error:", error);
    }
  }

  // Cache keys for different entities
  static getCompanyKey(userId: string): string {
    return `company:${userId}`;
  }

  static getICPKey(companyId: number): string {
    return `icp:${companyId}`;
  }

  static getCampaignKey(icpId: string): string {
    return `campaign:${icpId}`;
  }

  static getAnalysisKey(companyId: number): string {
    return `analysis:${companyId}`;
  }

  // Cache invalidation methods
  async invalidateCompanyCache(userId: string): Promise<void> {
    const key = RedisService.getCompanyKey(userId);
    await this.del(key);
  }

  async invalidateICPCache(companyId: number): Promise<void> {
    const key = RedisService.getICPKey(companyId);
    await this.del(key);
  }

  async invalidateCampaignCache(icpId: string): Promise<void> {
    const key = RedisService.getCampaignKey(icpId);
    await this.del(key);
  }

  async invalidateAnalysisCache(companyId: number): Promise<void> {
    const key = RedisService.getAnalysisKey(companyId);
    await this.del(key);
  }
}

export const redisService = RedisService.getInstance();
