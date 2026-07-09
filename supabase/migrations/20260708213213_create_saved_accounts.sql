/*
# Create saved_accounts table

## Purpose
Stores saved mobile money / bank account numbers for each user (identified
by phone). These saved accounts appear as selectable options on the
Withdrawal screen so the user does not have to retype them every time.

## New Tables
- `saved_accounts`
  - `id`             (uuid, primary key)
  - `phone`          (text, not null) — the user's login phone number
  - `account_number` (text, not null) — the saved mobile money / bank number
  - `account_name`   (text, not null) — the name registered on that number
  - `created_at`     (timestamptz, default now())

## Security
- RLS enabled.
- Anon + authenticated can SELECT, INSERT, DELETE (no auth sessions in this app).
- No UPDATE — users delete and re-add to change an entry.

## Notes
1. No user_id / auth.users FK — app uses phone-based login, no Supabase Auth.
2. USING (true) is intentional: shared no-auth app.
*/

CREATE TABLE IF NOT EXISTS saved_accounts (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  phone          text        NOT NULL,
  account_number text        NOT NULL,
  account_name   text        NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE saved_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_saved_accounts" ON saved_accounts;
CREATE POLICY "anon_select_saved_accounts" ON saved_accounts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_saved_accounts" ON saved_accounts;
CREATE POLICY "anon_insert_saved_accounts" ON saved_accounts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_saved_accounts" ON saved_accounts;
CREATE POLICY "anon_delete_saved_accounts" ON saved_accounts FOR DELETE
  TO anon, authenticated USING (true);
