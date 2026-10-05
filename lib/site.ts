export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN || "https://daydayday-ai.github.io";
export const siteUrl = `${siteOrigin}${basePath}`;
export function localPath(path: string) {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
export function assetPath(path: string) {
  return /^(https?:|data:)/.test(path) ? path : localPath(path);
}
