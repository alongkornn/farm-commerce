# Farm Commerce Frontend

Responsive marketplace frontend for the Farm Commerce backend. Built with
Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 and TanStack Query.

## User Areas

- Public storefront: products, farms and visit slots
- Authentication: buyer/seller registration, login and password recovery
- Buyer: cart, checkout, orders, refunds, bookings, addresses, favorites and notifications
- Seller: dashboard, products, orders, visit slots, bookings, closures and payouts
- Admin: seller approvals, refunds, coupons, users and payout runs

## Local Setup

Requirements: Node.js 22 and npm.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

The frontend runs at `http://localhost:3000`. Set the backend URL in
`.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api-dev.nexdev-tech.com/api/v1
```

All application screens use the configured backend API. Empty API collections
render explicit empty states instead of sample data. API functions matching the
backend routes live in `src/lib/api`.

The payment webhook is intentionally not called by the browser. It is a
server-to-server endpoint requiring the payment provider signature. The backend
currently has no endpoint for listing all users, so the admin users screen
states that limitation instead of showing sample users.

## Verification

```bash
npm run lint
npm run build
```

GitHub Actions runs both commands for pull requests and pushes to `main`,
`dev`, `stg` and `uat`.

## Docker

`NEXT_PUBLIC_API_URL` is a build-time variable because it is exposed to the
browser bundle.

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api/v1 \
  -t farm-commerce .

docker run --rm -p 3000:3000 farm-commerce
```

## Branch Flow

- `dev`: development deployment
- `stg`: staging deployment
- `uat`: acceptance testing
- `main`: production

Feature branches are merged progressively through these environment branches.
