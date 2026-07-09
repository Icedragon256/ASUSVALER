import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Plus, Trash2, CreditCard, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SavedAccount {
  id: string;
  account_number: string;
  account_name: string;
  created_at: string;
}

interface BindBankCardPageProps {
  phone: string;
  onBack: () => void;
}

export default function BindBankCardPage({ phone, onBack }: BindBankCardPageProps) {
  const [accounts, setAccounts] = useState<SavedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('saved_accounts')
      .select('id, account_number, account_name, created_at')
      .eq('phone', phone)
      .order('created_at', { ascending: false });
    setAccounts(data ?? []);
    setLoading(false);
  }, [phone]);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    const num = number.trim();
    const nm = name.trim();
    if (num.length < 9 || nm.length < 2) {
      setError('Please enter a valid number (min 9 digits) and name.');
      return;
    }
    setSaving(true);
    setError('');
    const { data, error: err } = await supabase
      .from('saved_accounts')
      .insert({ phone, account_number: num, account_name: nm })
      .select()
      .single();
    if (err) {
      setError('Failed to save. Please try again.');
    } else {
      setAccounts(prev => [data, ...prev]);
      setNumber('');
      setName('');
      setAdding(false);
      setSuccess('Account saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from('saved_accounts').delete().eq('id', id);
    setAccounts(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="min-h-screen bg-black max-w-[450px] mx-auto flex flex-col">
      {/* Nav */}
      <div className="sticky top-0 z-20 bg-[#191B1F] border-b border-white/10">
        <div className="flex items-center h-[46px] px-4">
          <button onClick={onBack} className="mr-auto">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[16px]">
            Bind Bank Card
          </span>
        </div>
      </div>

      <div className="px-4 pt-5 pb-8 space-y-4">
        {/* Info */}
        <div className="bg-[#1E2024] rounded-xl px-4 py-3">
          <p className="text-[#888] text-[12px] leading-relaxed">
            Save your mobile money or bank numbers here. Saved accounts will appear as options when you request a withdrawal.
          </p>
        </div>

        {/* Success toast */}
        {success && (
          <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-500/30 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-emerald-400 text-[13px]">{success}</span>
          </div>
        )}

        {/* Add new form */}
        {adding ? (
          <div className="bg-[#1E2024] rounded-xl px-4 py-4 space-y-3">
            <p className="text-white text-[15px] font-medium">Add New Account</p>

            <div>
              <p className="text-[#888] text-[11px] mb-1.5">Mobile Money / Bank Number</p>
              <input
                type="tel"
                className="w-full h-10 px-3 bg-[#111] border border-[#333] rounded-lg text-white text-[15px] focus:outline-none focus:border-[#6C2FE3] transition-colors"
                placeholder="e.g. 0771234567"
                value={number}
                onChange={(e) => { setNumber(e.target.value); setError(''); }}
              />
            </div>

            <div>
              <p className="text-[#888] text-[11px] mb-1.5">Account Holder Name</p>
              <input
                type="text"
                className="w-full h-10 px-3 bg-[#111] border border-[#333] rounded-lg text-white text-[15px] focus:outline-none focus:border-[#6C2FE3] transition-colors"
                placeholder="Full name on account"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(''); }}
              />
            </div>

            {error && <p className="text-red-400 text-[12px]">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setAdding(false); setError(''); setNumber(''); setName(''); }}
                className="flex-1 h-10 rounded-lg border border-[#444] text-[#888] text-[14px] hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="flex-1 h-10 rounded-lg bg-[#6C2FE3] text-white text-[14px] font-semibold disabled:opacity-50 hover:bg-[#5a20e0] transition-colors"
              >
                {saving ? 'Saving...' : 'Save Account'}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="w-full h-[50px] rounded-xl bg-[#6C2FE3]/10 border border-[#6C2FE3]/40 text-[#9B6FFF] font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#6C2FE3]/20 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add New Account
          </button>
        )}

        {/* Saved accounts list */}
        {loading ? (
          <div className="text-center py-8 text-[#555] text-[13px]">Loading...</div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-full bg-[#1E2024] flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-[#555]" />
            </div>
            <p className="text-[#666] text-[13px]">No accounts saved yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-[#888] text-[12px] px-1">Saved accounts ({accounts.length})</p>
            {accounts.map((a) => (
              <div key={a.id} className="bg-[#1E2024] rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#6C2FE3]/15 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-[#9B6FFF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[14px] font-semibold">{a.account_number}</p>
                  <p className="text-[#888] text-[12px]">{a.account_name}</p>
                </div>
                <button
                  onClick={() => handleDelete(a.id)}
                  disabled={deletingId === a.id}
                  className="w-8 h-8 flex items-center justify-center text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
