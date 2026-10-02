/**
 * Prefix a path with Astro's BASE_URL (e.g. for GitHub Pages subpaths)
 * Works seamlessly whether BASE_URL is '/' or '/kapginlian/'
 */
export function url(path: string = ""): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/" || cleanPath === "") {
    return base ? `${base}/` : "/";
  }
  return `${base}${cleanPath}`;
}
