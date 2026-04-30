# PRD — Literature Magazine Website
## CMS + Webshop

**Status:** Draft  
**Stack:** Next.js · TypeScript · Sanity.io · Stripe (pending)

---

## Overview

A website for a literature magazine featuring editorial content (articles, essays) alongside a small webshop selling current and back issues. Sanity.io serves as the single source of truth for all content and product data. Stripe handles payment processing when integrated.

---

## Goals

- Publish and manage editorial content (articles, author pages)
- Sell magazine issues (current + back catalogue) via a lightweight webshop
- Keep infrastructure simple: one CMS, no separate e-commerce database
- Stripe-ready data model from day one

---

## Data Model

### `issue` — Magazine Issue (Product)

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | e.g. "Issue 12 — Spring 2024" |
| `issueNumber` | `number` | Used for ordering and display |
| `coverImage` | `image` | Primary product image |
| `previewImages` | `array of image` | Gallery — spreads, interior shots, etc. |
| `description` | `portableText` | Rich editorial description |
| `price` | `number` | In minor currency unit (öre/cents) |
| `stripePriceId` | `string` | Stripe Price ID — populate when Stripe is integrated |
| `inStock` | `boolean` | Simple stock flag |
| `publishedAt` | `date` | Issue publication date |

**Notes:**
- `stripePriceId` field is defined in schema now, left empty until Stripe is connected. This avoids a schema migration later.
- `previewImages` supports drag-to-reorder in Sanity Studio. Each image should have alt text enabled.
- `price` stored in minor units to avoid float precision issues; format for display in the frontend.

---

### `article` — Editorial Content

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Article headline |
| `slug` | `slug` | URL path, sourced from title |
| `author` | `reference → author` | Required |
| `issue` | `reference → issue` | Optional — links article to a specific issue |
| `body` | `portableText` | Full article body |
| `publishedAt` | `datetime` | Controls visibility ordering |

---

### `author` — Author Profile

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Display name |
| `slug` | `slug` | For author archive pages |
| `bio` | `portableText` | Optional short biography |
| `image` | `image` | Optional portrait |

---

## Checkout Flow (Stripe — pending integration)

The data model is structured so that Stripe integration requires no schema changes.

**Planned flow:**

1. User views issue page — product data served from Sanity
2. User clicks "Buy" — Next.js API route creates a Stripe Checkout Session using `issue.stripePriceId`
3. User is redirected to Stripe Hosted Checkout
4. On success, Stripe webhook confirms payment — order record lives in Stripe
5. User is redirected to a confirmation page

```ts
// Future checkout route shape
const session = await stripe.checkout.sessions.create({
  line_items: [{ price: issue.stripePriceId, quantity: 1 }],
  mode: 'payment',
  success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${baseUrl}/shop/${issue.slug}`,
})
```

**What lives where:**
- Product content & pricing → Sanity
- Transactions, orders, customer records → Stripe
- No separate order database required at this scale

---

## Sanity Studio Setup

- Schemas: `issue`, `article`, `author`
- Desk structure: separate list views for Issues and Articles
- Image fields: hotspot + crop enabled, alt text required
- `previewImages` on `issue`: array with drag-to-reorder

---

## Next.js Integration Notes

- Use `next-sanity` with GROQ for data fetching
- ISR (Incremental Static Regeneration) for issue and article pages
- Sanity webhook → `revalidatePath` on publish for instant updates
- API routes needed: `/api/checkout` (Stripe, when integrated)

---

## Out of Scope (current phase)

- Customer accounts / order history
- Inventory management beyond `inStock` boolean
- Subscriptions
- Discount codes
- Stripe integration (pending access to client's Stripe account)
