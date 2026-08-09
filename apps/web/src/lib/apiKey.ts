import { Env } from '@/lib/Env';

export const API_KEY =
  process.env.API_KEY ||
  process.env.NEXT_PUBLIC_API_KEY ||
  Env.API_KEY ||
  Env.NEXT_PUBLIC_API_KEY ||
  '';
