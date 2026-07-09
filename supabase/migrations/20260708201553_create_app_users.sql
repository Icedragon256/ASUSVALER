/*
# Create app_users table

## Purpose
Stores registered users for the ASUS app. Each user registers with a
phone number and a hashed password. This enables real login, registration,
and password-change flows that persist across sessions.

## New Tables
- `app_users`
  - `id`            (uuid, primary key, auto-generated)
  - `phone`         (text, unique — the full number, e.g. "+256 758489586")
  - `password_hash` (text — SHA-256 hex of the user's password)
  - `created_at`    (timestamptz, auto-set on insert)

## Security
- RLS enabled on `app_users`.
- Anon + authenticated roles can SELECT, INSERT, and UPDATE so the
  frontend (which uses the anon key and has no Supabase Auth session)
  can perform login lookups, registration, and password changes.
- No DELETE policy — accounts cannot be deleted from the client.

## Notes
1. Password hashing is done client-side with the Web Crypto API (SHA-256)
   before any data hits the network.
2. The `phone` column is the unique user identifier — duplicate phone
   numbers are rejected by the UNIQUE constraint.
3. This table uses a fully open anon policy (USING true / WITH CHECK true)
   because there are no Supabase Auth sessions; ownership is enforced at
   the query level (WHERE phone = $1) in the application code.
*/

CREATE TABLE IF NOT EXISTS app_users (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         text        UNIQUE NOT NULL,
  password_hash text        NOT NULL,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_app_users" ON app_users;
CREATE POLICY "anon_select_app_users" ON app_users FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_app_users" ON app_users;
CREATE POLICY "anon_insert_app_users" ON app_users FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_app_users" ON app_users;
CREATE POLICY "anon_update_app_users" ON app_users FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
