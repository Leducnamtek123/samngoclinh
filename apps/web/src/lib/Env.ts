import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const Env = createEnv({
  server: {
    ARCJET_KEY: z.string().startsWith('ajkey_').optional(),
    CLERK_SECRET_KEY: z.string().optional(),
    DATABASE_URL: z.string().optional(),
    INTERNAL_API_URL: z.string().optional(),
    API_KEY: z.string().default(''),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_ADMIN_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_LOGGING_LEVEL: z
      .enum(['error', 'info', 'debug', 'warning', 'trace', 'fatal'])
      .default('info'),
    NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: z.string().optional(),
    NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string().optional(),
    NEXT_PUBLIC_API_KEY: z.string().optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  runtimeEnv: {
    INTERNAL_API_URL: process.env.INTERNAL_API_URL,
    ARCJET_KEY: process.env.ARCJET_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    API_KEY: process.env.API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_LOGGING_LEVEL: process.env.NEXT_PUBLIC_LOGGING_LEVEL,
    NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN: process.env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN,
    NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST: process.env.NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
