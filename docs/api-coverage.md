# API Coverage

The frontend uses `NEXT_PUBLIC_API_URL` and currently targets:

`https://api-dev.nexdev-tech.com/api/v1`

## Connected Areas

- Authentication: buyer, seller and admin registration, login, refresh and logout
- Account: profile, password, email verification, password reset and account closure
- Catalog: products, sellers, seller products, visit slots and reviews
- Buyer: cart, checkout, orders, refunds, bookings, addresses, favorites and notifications
- Seller: profile, products, image upload, orders, visit slots, bookings, check-in, closures, dashboard and payouts
- Admin: pending sellers, seller review, refunds, coupons and payout runs

## Intentional Exceptions

- `POST /payments/webhook` is server-to-server and must be called by the
  payment provider with `X-Webhook-Signature`. It must not be exposed through
  the browser UI.
- The backend has no endpoint for listing or managing all users. The admin
  users screen reports this limitation and does not display sample data.
- `GET /test` is a diagnostic endpoint and is not part of an application
  workflow.

Empty API arrays render explicit empty states. The UI contains no mock
marketplace records.
