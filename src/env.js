import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url().default("redis://localhost:6379"),
    NEXTAUTH_SECRET: z
      .string()
      .min(1)
      .default("your-secret-key-change-in-production"),
    NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
    GITHUB_CLIENT_ID: z.string().min(1).default("your-github-client-id"),
    GITHUB_CLIENT_SECRET: z
      .string()
      .min(1)
      .default("your-github-client-secret"),
    OPENAI_API_KEY: z.string().min(1).default("your-openai-api-key"),
  },
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
