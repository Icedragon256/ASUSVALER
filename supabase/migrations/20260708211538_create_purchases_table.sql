/*
# Create purchases table

## Purpose
Records every confirmed product purchase. Links to a user by their phone
number (the app's login identifier). Stores a full snapshot of the product
at purchase time so display never breaks if product details change.

## New Tables
- `purchases`
  - `id`           (uuid, primary key, auto-generated)
  - `phone`        (text, not null) — the buyer's phone number
  - `vip`          (text, not null) — e.g. "VIP1"
  - `name`         (text, not null) — product display name
  - `price_num`    (integer, not null) — numeric price in UGX
  - `price`        (text, not null) — formatted price string e.g. "15,000"
  - `daily`        (text, not null) — formatted daily income e.g. "3,000"
  - `total`        (text, not null) — formatted total revenue e.g. "540,000"
  - `img`          (text, not null) — image path
  - `purchased_at` (timestamptz, default now())

## Security
- RLS enabled.
- Anon + authenticated can SELECT, INSERT (no auth sessions in this app).
- No UPDATE / DELETE — purchases are immutable records.

## Notes
1. No user_id / auth.users FK because the app uses phone-based login
   without Supabase Auth sessions.
2. USING (true) is intentional — no per-user auth sessions exist.
*/

CREATE TABLE IF NOT EXISTS purchases (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone        text        NOT NULL,
  vip          text        NOT NULL,
  name         text        NOT NULL,
  price_num    integer     NOT NULL,
  price        text        NOT NULL,
  daily        text        NOT NULL,
  total        text        NOT NULL,
  img          text        NOT NULL,
  purchased_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_purchases" ON purchases;
CREATE POLICY "anon_select_purchases" ON purchases FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_purchases" ON purchases;
CREATE POLICY "anon_insert_purchases" ON purchases FOR INSERT
  TO anon, authenticated WITH CHECK (true);
