import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface AuthResult {
  error: string | null;
  balance: number;
  referralCode: string;
}

export async function registerUser(
  phone: string,
  password: string,
  referredBy?: string,
): Promise<AuthResult> {
  const hash = await hashPassword(password);
  const { error } = await supabase.from('app_users').insert({
    phone,
    password_hash: hash,
    referred_by: referredBy || null,
  });
  if (error) {
    if (error.code === '23505') return { error: 'This phone number is already registered.', balance: 0, referralCode: '' };
    return { error: error.message, balance: 0, referralCode: '' };
  }
  const { data } = await supabase
    .from('app_users')
    .select('referral_code')
    .eq('phone', phone)
    .maybeSingle();
  return { error: null, balance: 5000, referralCode: data?.referral_code ?? '' };
}

export async function loginUser(phone: string, password: string): Promise<AuthResult> {
  const hash = await hashPassword(password);
  const { data, error } = await supabase
    .from('app_users')
    .select('id, balance, referral_code')
    .eq('phone', phone)
    .eq('password_hash', hash)
    .maybeSingle();
  if (error) return { error: error.message, balance: 0, referralCode: '' };
  if (!data) return { error: 'Incorrect phone number or password.', balance: 0, referralCode: '' };
  return { error: null, balance: data.balance, referralCode: data.referral_code ?? '' };
}

export async function changePassword(
  phone: string,
  currentPassword: string,
  newPassword: string,
): Promise<string | null> {
  const currentHash = await hashPassword(currentPassword);
  const newHash = await hashPassword(newPassword);

  const { data: user, error: lookupError } = await supabase
    .from('app_users')
    .select('id')
    .eq('phone', phone)
    .eq('password_hash', currentHash)
    .maybeSingle();

  if (lookupError) return lookupError.message;
  if (!user) return 'Current password is incorrect.';

  const { error: updateError } = await supabase
    .from('app_users')
    .update({ password_hash: newHash })
    .eq('phone', phone);

  if (updateError) return updateError.message;
  return null;
}

export async function updateBalance(phone: string, balance: number): Promise<void> {
  await supabase.from('app_users').update({ balance }).eq('phone', phone);
}
