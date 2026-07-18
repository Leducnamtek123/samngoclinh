import '@generated/prisma-client';

declare module '@generated/prisma-client' {
  export interface UserTermPolicy {
    termsOfService: boolean;
    privacy: boolean;
    marketing: boolean;
    cookies: boolean;
  }

  export interface RoleAbility {
    action: string[];
    subject: string;
  }

  export interface UserPhoto {
    bucket: string;
    key: string;
    cdnUrl?: string | null;
    completedUrl: string;
    mime: string;
    extension: string;
    access: string;
  }

  export interface TermPolicyContent {
    language: string;
    bucket: string;
    key: string;
    cdnUrl?: string | null;
    completedUrl: string;
    mime: string;
    extension: string;
    access: string;
    size: number;
  }

  export interface UserAgentBrowser {
    name?: string | null;
    version?: string | null;
    major?: string | null;
    type?: string | null;
  }

  export interface UserAgentCpu {
    architecture?: string | null;
  }

  export interface UserAgentDevice {
    type?: string | null;
    vendor?: string | null;
    model?: string | null;
  }

  export interface UserAgentEngine {
    name?: string | null;
    version?: string | null;
  }

  export interface UserAgentOs {
    name?: string | null;
    version?: string | null;
  }

  export interface UserAgent {
    ua?: string | null;
    browser?: UserAgentBrowser | null;
    cpu?: UserAgentCpu | null;
    device?: UserAgentDevice | null;
    engine?: UserAgentEngine | null;
    os?: UserAgentOs | null;
  }

  export interface GeoLocation {
    latitude: number;
    longitude: number;
    country: string;
    region: string;
    city: string;
  }

  export interface CartItem {
    productId: string;
    quantity: number;
    price: number;
  }
}
