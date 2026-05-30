# ⬡ ONE ELEMENT — Activewear Store

Full Angular 17 e-commerce storefront for ONE ELEMENT Activewear — premium unisex activewear brand, India.

## Quick Start

```bash
npm install
ng serve
# Open: http://localhost:4200
```

## Folder Structure

```
src/app/
  core/
    models/         → product.model.ts (interfaces)
    services/       → product, cart, wishlist, toast services
  shared/
    components/     → navbar, footer, product-card, cart-sidebar, toast
  features/
    home/           → Hero, categories, featured, newsletter
    shop/           → Filterable product grid
    product-detail/ → Gallery, size/color picker, tabs
    cart/           → Cart page
    checkout/       → 3-step checkout flow
    wishlist/       → Saved products
    about/          → Brand story page
    not-found/      → 404
```

## Pages / Routes

| Route            | Page           |
|-----------------|----------------|
| /               | Home           |
| /shop           | Shop (all)     |
| /shop?gender=men | Men's         |
| /shop?filter=new | New Arrivals  |
| /shop?filter=sale | Sale         |
| /product/:id    | Product Detail |
| /cart           | Cart           |
| /checkout       | Checkout       |
| /wishlist       | Wishlist       |
| /about          | About          |

## Key Features

- Angular 17 Signals for reactive state (no extra libs needed)
- Standalone components + lazy-loaded routes
- 12 realistic ONE ELEMENT activewear products
- Cart sidebar with free-shipping progress bar
- Wishlist with local persistence
- Shop: filter by gender, badge, price, search + sort
- 3-step checkout with order confirmation
- Mobile responsive (burger menu, drawer sidebar)
- Dark athletic design: Barlow Condensed + Space Mono fonts, #e6ff00 accent

## Production Build

```bash
ng build --configuration=production
# Output → dist/one-element-store/browser/
```

## Deploy to Vercel / Netlify
Upload dist/one-element-store/browser/ and set all routes to redirect to index.html (200).

## Connect to Real Shopify

1. Enable Shopify Storefront API
2. Replace ProductService with Storefront GraphQL queries
3. Wire checkout to Shopify cart API or redirect to Shopify checkout URL

---
ONE ELEMENT Activewear · Angular 17 · India
# ONE-ELEMENT
