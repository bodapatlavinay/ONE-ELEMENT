import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Product } from '../models/product.model';

const SHOPIFY_DOMAIN = 'elements-10037.myshopify.com';
const STOREFRONT_TOKEN = 'f456028b7db8b786fb8af241f7acad60';
const API_VERSION = '2025-01';
const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

const HEADERS = new HttpHeaders({
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
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
          images(first: 5) {
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
              }
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors { field message }
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class ShopifyService {
  private http = inject(HttpClient);

  getProducts(count = 50): Observable<Product[]> {
    return this.http.post<any>(ENDPOINT, {
      query: PRODUCTS_QUERY,
      variables: { first: count }
    }, { headers: HEADERS }).pipe(
      map(res => {
        const edges = res?.data?.products?.edges ?? [];
        console.log(`Shopify: fetched ${edges.length} products`);
        return edges.map((e: any) => this.mapProduct(e.node));
      }),
      catchError(err => {
        console.error('Shopify products fetch failed:', err);
        return of([]);
      })
    );
  }

  createCheckout(items: { variantId: string; quantity: number }[]): Observable<string | null> {
    const lines = items.map(i => ({ merchandiseId: i.variantId, quantity: i.quantity }));
    return this.http.post<any>(ENDPOINT, {
      query: CART_CREATE_MUTATION,
      variables: { lines }
    }, { headers: HEADERS }).pipe(
      map(res => res.data?.cartCreate?.cart?.checkoutUrl ?? null),
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

    // Extract sizes and colors from variant options
    const sizes = [...new Set<string>(
      variants.flatMap((v: any) =>
        v.selectedOptions.filter((o: any) => o.name.toLowerCase() === 'size').map((o: any) => o.value)
      )
    )];
    const colors = [...new Set<string>(
      variants.flatMap((v: any) =>
        v.selectedOptions.filter((o: any) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour').map((o: any) => o.value)
      )
    )];

    // Determine gender from tags or product type
    const tags = node.tags as string[];
    const typeLower = (node.productType as string).toLowerCase();
    let gender: 'Men' | 'Women' | 'Unisex' = 'Unisex';
    if (tags.includes('men') || typeLower.includes('men')) gender = 'Men';
    else if (tags.includes('women') || typeLower.includes('women')) gender = 'Women';

    // Badge from tags
    let badge: 'NEW' | 'SALE' | 'BESTSELLER' | 'LIMITED' | undefined;
    if (tags.includes('new')) badge = 'NEW';
    else if (tags.includes('sale') || originalPrice) badge = 'SALE';
    else if (tags.includes('bestseller')) badge = 'BESTSELLER';
    else if (tags.includes('limited')) badge = 'LIMITED';

    // Show all products — even 0 stock (customers can still see them)
    const stock = variants.reduce((sum: number, v: any) => sum + (v.quantityAvailable ?? 0), 0);

    return {
      id: numericId,
      title: node.title,
      description: node.description || '',
      category: node.productType || 'activewear',
      price,
      originalPrice,
      image: images[0] ?? '',
      images,
      rating: { rate: 4.7, count: 0 },
      stock,
      badge,
      sizes: sizes.length ? sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: colors.length ? colors : ['Black'],
      gender,
      tags,
      // Store variant IDs for checkout — keyed by size
      ...(variants.length && { variantId: variants[0].id })
    } as Product;
  }
}
