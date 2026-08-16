import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

export const Env = createEnv({
  server: {
    DATABASE_URL: z.string().optional(),
    INTERNAL_API_URL: z.string().optional(),
    API_KEY: z.string().default(''),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_ADMIN_URL: z.string().optional(),
    NEXT_PUBLIC_API_URL: z.string().optional(),
    NEXT_PUBLIC_API_KEY: z.string().optional(),
  },
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  runtimeEnv: {
    INTERNAL_API_URL: process.env.INTERNAL_API_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    API_KEY: process.env.API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
