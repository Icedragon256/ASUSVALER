/*
# Add balance column to app_users

## Purpose
Tracks each user's UGX balance directly on their account row so it
persists across sessions. New registrations automatically receive
UGX 5,000 as a registration bonus (set by the column DEFAULT).

## Modified Tables
- `app_users`
  - New column: `balance` (integer, not null, default 5000)
    — For all existing rows (created before this migration), balance
      is set to 7200 to match the app's previous hardcoded starting value.
    — All NEW inserts (new registrations) will automatically get 5000.

## Notes
1. The DEFAULT 5000 only governs new inserts going forward.
2. We immediately UPDATE existing rows to 7200 so current test accounts
   keep the balance they were seeing.
3. No RLS changes needed — the existing anon UPDATE policy already
   covers this column.
*/

ALTER TABLE app_users
  ADD COLUMN IF NOT EXISTS balance INTEGER NOT NULL DEFAULT 5000;

UPDATE app_users SET balance = 7200;
