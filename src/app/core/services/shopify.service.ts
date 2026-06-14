import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

const { domain, storefrontToken, apiVersion } = environment.shopify;
const ENDPOINT = `https://${domain}/api/${apiVersion}/graphql.json`;

// Cached proxy endpoint — served from Vercel's edge CDN (10-min cache).
// Falls back to direct Shopify call in local dev where /api/products doesn't exist.
const CACHED_ENDPOINT = '/api/products';

const HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': storefrontToken
});

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first, sortKey: TITLE) {
      edges {
        node {
          id
          title
          description
          productType
          tags
          vendor
          availableForSale
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount }
          }
          images(first: 20) {
            edges { node { url altText } }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
                price { amount }
                compareAtPrice { amount }
                selectedOptions { name value }
                image { url altText }
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!, $buyerIdentity: CartBuyerIdentityInput) {
    cartCreate(input: { lines: $lines, buyerIdentity: $buyerIdentity }) {
      cart {
        id
        checkoutUrl
      }
      userErrors { field message }
    }
  }
`;

export interface BuyerInfo {
  email?: string;
  phone?: string;
  address1?: string;
  city?: string;
  province?: string;
  zip?: string;
  countryCode?: string;
}

@Injectable({ providedIn: 'root' })
export class ShopifyService {
  private http = inject(HttpClient);

  getProducts(count = 100): Observable<Product[]> {
    // Always call Shopify Storefront API directly — Storefront tokens are public/read-only safe
    return this.http.post<any>(ENDPOINT, { query: PRODUCTS_QUERY, variables: { first: count } }, { headers: HEADERS }).pipe(
      map(res => {
        const edges = res?.data?.products?.edges ?? [];
        console.log(`Shopify: fetched ${edges.length} products`);
        return edges.map((e: any) => this.mapProduct(e.node));
      }),
      catchError(() => of([]))
    );
  }

  createCheckout(
    items: { variantId: string; quantity: number }[],
    buyer?: BuyerInfo
  ): Observable<string | null> {
    const lines = items.map(i => ({ merchandiseId: i.variantId, quantity: i.quantity }));

    const buyerIdentity: any = {};
    if (buyer?.email) buyerIdentity['email'] = buyer.email;
    if (buyer?.phone) buyerIdentity['phone'] = buyer.phone;
    if (buyer?.address1) {
      buyerIdentity['deliveryAddressPreferences'] = [{
        deliveryAddress: {
          address1: buyer.address1,
          city: buyer.city ?? '',
          province: buyer.province ?? '',
          zip: buyer.zip ?? '',
          countryCode: buyer.countryCode ?? 'IN'
        }
      }];
    }

    return this.http.post<any>(ENDPOINT, {
      query: CART_CREATE_MUTATION,
      variables: {
        lines,
        buyerIdentity: Object.keys(buyerIdentity).length ? buyerIdentity : undefined
      }
    }, { headers: HEADERS }).pipe(
      map(res => {
        const errors = res.data?.cartCreate?.userErrors;
        if (errors?.length) {
          console.error('Shopify cart errors:', errors);
        }
        return res.data?.cartCreate?.cart?.checkoutUrl ?? null;
      }),
      catchError(err => {
        console.error('Shopify checkout create failed:', err);
        return of(null);
      })
    );
  }

  private mapProduct(node: any): Product {
    const numericId = parseInt(node.id.replace('gid://shopify/Product/', ''), 10);
    const price = Math.round(parseFloat(node.priceRange.minVariantPrice.amount));
    const compareAt = parseFloat(node.compareAtPriceRange?.minVariantPrice?.amount ?? '0');
    const originalPrice = compareAt > price ? Math.round(compareAt) : undefined;

    const images = node.images.edges.map((e: any) => e.node.url);
    const variants = node.variants.edges.map((e: any) => e.node);

    // Extract unique sizes and colors from variant options
    const sizes = [...new Set<string>(
      variants.flatMap((v: any) =>
        v.selectedOptions
          .filter((o: any) => o.name.toLowerCase() === 'size')
          .map((o: any) => o.value)
      )
    )];
    const colors = [...new Set<string>(
      variants.flatMap((v: any) =>
        v.selectedOptions
          .filter((o: any) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour')
          .map((o: any) => o.value)
      )
    )];

    // Build size → variantId map for correct checkout variant selection
    const variantMap: Record<string, string> = {};
    for (const v of variants) {
      const sizeOpt = v.selectedOptions.find((o: any) => o.name.toLowerCase() === 'size');
      if (sizeOpt) {
        variantMap[sizeOpt.value] = v.id;
      } else {
        // No size option — map by variant title as fallback
        variantMap[v.title] = v.id;
      }
    }

    // Build colorImages from image alt text (primary) or variant.image (fallback)
    // Convention: set image alt text to the color name in Shopify (e.g. "Onyx Black", "Stone white")
    const allImageNodes: { url: string; altText: string | null }[] =
      node.images.edges.map((e: any) => e.node);
    const colorImages: Record<string, string[]> = {};

    // Primary: group product images by altText matching a known color
    for (const img of allImageNodes) {
      const alt = img.altText?.toLowerCase() ?? '';
      const matchedColor = colors.find(c => alt.includes(c.toLowerCase()));
      if (matchedColor) {
        if (!colorImages[matchedColor]) colorImages[matchedColor] = [];
        colorImages[matchedColor].push(img.url);
      }
    }

    // Fallback: if alt-text approach yielded nothing, try variant.image per color
    if (!Object.keys(colorImages).length) {
      const seenPerColor: Record<string, Set<string>> = {};
      for (const v of variants) {
        const colorOpt = v.selectedOptions.find(
          (o: any) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour'
        );
        if (colorOpt && v.image?.url) {
          const c = colorOpt.value;
          if (!colorImages[c]) { colorImages[c] = []; seenPerColor[c] = new Set(); }
          if (!seenPerColor[c].has(v.image.url)) {
            colorImages[c].push(v.image.url);
            seenPerColor[c].add(v.image.url);
          }
        }
      }
    }

    // Normalise tags to lowercase for all comparisons
    const tags: string[] = node.tags;
    const tagsLower = tags.map((t: string) => t.toLowerCase());
    const typeLower = (node.productType as string).toLowerCase();

    // Determine gender — handle capitalization & common variations
    let gender: 'Men' | 'Women' | 'Unisex' = 'Unisex';
    const isWomen = tagsLower.some(t => ['women', 'womens', "women's", 'female', 'ladies'].includes(t))
      || typeLower.includes('women');
    const isMen = tagsLower.some(t => ['men', 'mens', "men's", 'male'].includes(t))
      || typeLower.includes('men');
    if (isWomen) gender = 'Women'; // check women first so "women" doesn't match "men" substring
    else if (isMen) gender = 'Men';

    // Badge from tags (case-insensitive) or compare-at price
    let badge: 'NEW' | 'SALE' | 'BESTSELLER' | 'LIMITED' | undefined;
    if (tagsLower.includes('new')) badge = 'NEW';
    else if (tagsLower.includes('sale') || originalPrice) badge = 'SALE';
    else if (tagsLower.includes('bestseller')) badge = 'BESTSELLER';
    else if (tagsLower.includes('limited')) badge = 'LIMITED';

    const stock = variants.reduce((sum: number, v: any) => sum + (v.quantityAvailable ?? 0), 0);

    return {
      id: numericId,
      shopifyId: node.id,
      title: node.title,
      description: node.description || '',
      category: node.productType || 'activewear',
      price,
      originalPrice,
      image: images[0] ?? '',
      images,
      colorImages: Object.keys(colorImages).length ? colorImages : undefined,
      rating: { rate: 4.7, count: 0 },
      stock,
      badge,
      sizes: sizes.length ? sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: colors.length ? colors : ['Black'],
      gender,
      tags: tagsLower, // store normalised lowercase tags so shop filters always match
      variantId: variants[0]?.id,
      variantMap
    };
  }
}
