/**
 * Vercel Edge-cached Shopify product proxy
 *
 * Why this exists:
 *   The Shopify Storefront API is rate-limited (~2 req/s per store).
 *   Without this layer, every visitor's browser calls Shopify directly.
 *   With this layer, Vercel's CDN caches the response for 10 minutes —
 *   so 1,000 simultaneous users = 1 Shopify call per 10 minutes, not 1,000.
 *
 * Cache behaviour (Vercel CDN):
 *   s-maxage=600          → edge cache for 10 minutes
 *   stale-while-revalidate=30 → serve stale instantly while refreshing in background
 */

const SHOPIFY_DOMAIN = 'elements-10037.myshopify.com';
const STOREFRONT_TOKEN = 'f456028b7db8b786fb8af241f7acad60';
const API_VERSION = '2025-01';
const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first, sortKey: TITLE) {
      edges {
        node {
          id title description productType tags vendor availableForSale
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 20) {
            edges {
              node {
                id title availableForSale quantityAvailable
                price { amount }
                compareAtPrice { amount }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    }
  }
`;

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first: 100 },
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify responded with ${response.status}`);
    }

    const data = await response.json();

    // Tell Vercel's CDN to cache this response for 10 minutes,
    // and serve stale for 30 more seconds while revalidating in background.
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=30');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(data);
  } catch (err) {
    console.error('Shopify proxy error:', err);
    // Don't cache errors
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}
