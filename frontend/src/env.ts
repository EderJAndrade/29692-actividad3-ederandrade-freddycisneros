export const env = {
  AUTHORS_API_URL: import.meta.env.VITE_AUTHORS_API_URL as string,
  PUBLICATIONS_API_URL: import.meta.env.VITE_PUBLICATIONS_API_URL as string,
};

if (!env.AUTHORS_API_URL || !env.PUBLICATIONS_API_URL) {
  console.warn("Missing VITE_AUTHORS_API_URL or VITE_PUBLICATIONS_API_URL");
}
