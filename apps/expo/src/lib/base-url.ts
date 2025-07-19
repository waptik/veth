/**
 * Extend this function when going to production by
 * setting the baseUrl to your production API URL.
 */
export const getBaseUrl = () => {
  if (__DEV__) {
    return "http://localhost:8787"; // Default port for Miniflare-Hono app in development
  }
  return `${process.env.EXPO_PUBLIC_API_URL}`;
};
