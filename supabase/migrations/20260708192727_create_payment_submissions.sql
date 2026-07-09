/*
# Create payment_submissions table + storage bucket

1. New Tables
   - `payment_submissions`
     - `id` (uuid, primary key)
     - `amount` (integer, not null) — amount in UGX the user claims to have sent
     - `network` (text, not null) — 'mtn' or 'airtel'
     - `screenshot_url` (text, nullable) — public URL of uploaded proof screenshot
     - `status` (text, default 'pending') — 'pending' | 'confirmed' | 'rejected'
     - `notes` (text, nullable) — admin notes
     - `submitted_at` (timestamptz, default now())

2. Storage
   - Creates `payment-screenshots` bucket (public) for screenshot uploads
   - Policies allow anon + authenticated users to upload and read files

3. Security
   - RLS enabled on `payment_submissions`
   - Anon + authenticated users can INSERT (submit proof)
   - Anon + authenticated users can SELECT (admin reads without auth)
   - Anon + authenticated users can UPDATE (admin can change status/notes)

4. Notes
   - Single-tenant design — no user_id, no auth required
   - Admin uses the same anon key to view and update submissions
*/

CREATE TABLE IF NOT EXISTS payment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount integer NOT NULL,
  network text NOT NULL,
  screenshot_url text,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_submissions" ON payment_submissions;
CREATE POLICY "anon_select_submissions" ON payment_submissions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_submissions" ON payment_submissions;
CREATE POLICY "anon_insert_submissions" ON payment_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_submissions" ON payment_submissions;
CREATE POLICY "anon_update_submissions" ON payment_submissions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "allow_anon_screenshot_upload" ON storage.objects;
CREATE POLICY "allow_anon_screenshot_upload" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'payment-screenshots');

DROP POLICY IF EXISTS "allow_public_screenshot_read" ON storage.objects;
CREATE POLICY "allow_public_screenshot_read" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'payment-screenshots');
