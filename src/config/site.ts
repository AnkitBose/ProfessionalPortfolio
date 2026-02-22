export const siteConfig = {
  name: "Ankit Bose",
  role: "Cyber Security Manager",
  company: "PwC Canada",
  githubUsername: "AnkitBose",
  githubRepo: "ProfessionalPortfolio",
  linkedinUrl: "https://www.linkedin.com/in/ankit-bose-497a808a/",
  canonicalBaseUrl: "https://AnkitBose.github.io/ProfessionalPortfolio/",
  projectBasePath: "/ProfessionalPortfolio/",
  features: {
    analytics: {
      cloudflare: {
        enabled: import.meta.env.PUBLIC_ENABLE_CF_ANALYTICS === "true",
        token: import.meta.env.PUBLIC_CF_ANALYTICS_TOKEN ?? ""
      },
      ga4: {
        enabled: import.meta.env.PUBLIC_ENABLE_GA4 === "true",
        measurementId: import.meta.env.PUBLIC_GA4_MEASUREMENT_ID ?? ""
      }
    },
    contact: {
      revealEmail: {
        enabled: import.meta.env.PUBLIC_ENABLE_EMAIL_REVEAL === "true",
        value: import.meta.env.PUBLIC_CONTACT_EMAIL ?? ""
      }
    }
  }
} as const;

export const toBasePath = (path = ""): string => {
  const base = import.meta.env.BASE_URL ?? "/";
  const normalized = path.replace(/^\/+/, "");
  return normalized ? `${base}${normalized}` : base;
};



