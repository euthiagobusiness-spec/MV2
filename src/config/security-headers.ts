const isDev = process.env.NODE_ENV !== "production";

function createContentSecurityPolicy(allowBlobScripts = false) {
  const blobScriptSource = allowBlobScripts ? " blob:" : "";

  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${blobScriptSource}${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' blob: https://*.supabase.co wss://*.supabase.co",
    "worker-src 'self' blob:",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://my.matterport.com https://www.google.com",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export const tourContentSecurityPolicy = createContentSecurityPolicy(true);

export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: createContentSecurityPolicy(),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), browsing-topics=()",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
];
