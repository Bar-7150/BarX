import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("BarX"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional().or(z.literal("")),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional().or(z.literal("")),
  RAZORPAY_KEY_SECRET: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().or(z.literal("")),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional().or(z.literal("")),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success && process.env.NODE_ENV === "production") {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join(".") || issue.message).join(", ")}`);
}

const baseEnv = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "BarX",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  isProduction: (process.env.NODE_ENV ?? "development") === "production",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? "",
  gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
};

export const env = {
  appName: parsed.success ? parsed.data.NEXT_PUBLIC_APP_NAME ?? baseEnv.appName : baseEnv.appName,
  appUrl: parsed.success ? parsed.data.NEXT_PUBLIC_APP_URL ?? baseEnv.appUrl : baseEnv.appUrl,
  siteUrl: parsed.success ? parsed.data.NEXT_PUBLIC_SITE_URL ?? baseEnv.siteUrl : baseEnv.siteUrl,
  isProduction: parsed.success ? parsed.data.NODE_ENV === "production" : baseEnv.isProduction,
  supabaseUrl: parsed.success ? parsed.data.NEXT_PUBLIC_SUPABASE_URL ?? baseEnv.supabaseUrl : baseEnv.supabaseUrl,
  supabaseAnonKey: parsed.success ? parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? baseEnv.supabaseAnonKey : baseEnv.supabaseAnonKey,
  supabaseServiceRoleKey: parsed.success ? parsed.data.SUPABASE_SERVICE_ROLE_KEY ?? baseEnv.supabaseServiceRoleKey : baseEnv.supabaseServiceRoleKey,
  razorpayKeyId: parsed.success ? parsed.data.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? baseEnv.razorpayKeyId : baseEnv.razorpayKeyId,
  razorpayKeySecret: parsed.success ? parsed.data.RAZORPAY_KEY_SECRET ?? baseEnv.razorpayKeySecret : baseEnv.razorpayKeySecret,
  gaMeasurementId: parsed.success ? parsed.data.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? baseEnv.gaMeasurementId : baseEnv.gaMeasurementId,
  sentryDsn: parsed.success ? parsed.data.NEXT_PUBLIC_SENTRY_DSN ?? baseEnv.sentryDsn : baseEnv.sentryDsn,
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isRazorpayConfigured = Boolean(env.razorpayKeyId && env.razorpayKeySecret);
