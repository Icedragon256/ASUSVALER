import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Copy, CheckCheck, Users, Gift, TrendingUp, Link2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Referral {
  phone: string;
  created_at: string;
}

interface RewardsPageProps {
  phone: string;
  referralCode: string;
  onBack: () => void;
}

export default function RewardsPage({ phone: _phone, referralCode, onBack }: RewardsPageProps) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const load = useCallback(async () => {
    if (!referralCode) return;
    setLoading(true);
    const { data } = await supabase
      .from('app_users')
      .select('phone, created_at')
      .eq('referred_by', referralCode)
      .order('created_at', { ascending: false });
    setReferrals(data ?? []);
    setLoading(false);
  }, [referralCode]);

  useEffect(() => { load(); }, [load]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const maskPhone = (p: string) => {
    const clean = p.replace(/\s/g, '');
    if (clean.length <= 6) return '***';
    return clean.slice(0, 3) + '***' + clean.slice(-4);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-UG', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-black max-w-[450px] mx-auto flex flex-col">
      {/* Nav */}
      <div className="sticky top-0 z-20 bg-[#191B1F] border-b border-white/10">
        <div className="flex items-center h-[46px] px-4">
          <button onClick={onBack} className="mr-auto">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[16px]">
            Rewards
          </span>
        </div>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden bg-[#6C2FE3] px-5 pt-6 pb-8">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute -left-4 bottom-0 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10">
          <p className="text-white/80 text-[12px] tracking-widest uppercase font-semibold">Invite &amp; Earn</p>
          <h1 className="text-white text-[22px] font-bold mt-1 leading-tight">Share your code,<br/>earn commissions</h1>
          <p className="text-white/70 text-[13px] mt-2 leading-relaxed">
            Invite friends to join ASUS Investment. Earn 35% commission on their first investment level.
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4">
        {/* Your referral code */}
        <div className="bg-[#191B1F] rounded-2xl p-4">
          <p className="text-[#888] text-[12px] mb-3 uppercase tracking-wide font-semibold">Your Invitation Code</p>
          <div className="flex items-center gap-3">
            {/* Code display — styled like the VIP badge */}
            <div className="flex-1 text-[22px] font-bold bg-transparent text-center flex items-center justify-center h-[52px] text-white border border-[#727272] rounded-[8px] tracking-[6px] select-all">
              {referralCode || '---'}
            </div>
            <button
              onClick={copyCode}
              className={`flex items-center gap-1.5 px-4 h-[52px] rounded-[8px] border transition-all text-[13px] font-semibold flex-shrink-0 ${
                codeCopied
                  ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10'
                  : 'border-[#6C2FE3] text-[#9B6FFF] bg-[#6C2FE3]/10 hover:bg-[#6C2FE3]/20'
              }`}
            >
              {codeCopied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {codeCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Your referral link */}
        <div className="bg-[#191B1F] rounded-2xl p-4">
          <p className="text-[#888] text-[12px] mb-3 uppercase tracking-wide font-semibold">Your Invitation Link</p>
          <div className="flex items-center gap-2 bg-[#111] rounded-lg border border-[#333] px-3 py-2.5 mb-3">
            <Link2 className="w-4 h-4 text-[#555] flex-shrink-0" />
            <p className="text-[#888] text-[11px] truncate flex-1">{referralLink}</p>
          </div>
          <button
            onClick={copyLink}
            className={`w-full h-[44px] rounded-lg border font-semibold text-[14px] flex items-center justify-center gap-2 transition-all ${
              linkCopied
                ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10'
                : 'border-[#6C2FE3] text-[#9B6FFF] bg-[#6C2FE3]/10 hover:bg-[#6C2FE3]/20'
            }`}
          >
            {linkCopied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {linkCopied ? 'Link Copied!' : 'Copy Invitation Link'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={Users} label="Invited" value={String(referrals.length)} color="text-[#6C2FE3]" />
          <StatCard icon={TrendingUp} label="Level 1 Rate" value="35%" color="text-emerald-400" />
          <StatCard icon={Gift} label="Commission" value="Active" color="text-yellow-400" />
        </div>

        {/* Commission table */}
        <div className="bg-[#191B1F] rounded-2xl overflow-hidden">
          <div className="bg-[#6C2FE3] px-4 py-3">
            <p className="text-white font-semibold text-[14px]">Commission Structure</p>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { level: 'Level 1', desc: 'Direct invites', rate: '35%', color: 'text-emerald-400' },
              { level: 'Level 2', desc: 'Their invites', rate: '2%', color: 'text-blue-400' },
              { level: 'Level 3', desc: 'Their invites\' invites', rate: '1%', color: 'text-yellow-400' },
            ].map(({ level, desc, rate, color }) => (
              <div key={level} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-white text-[13px] font-medium">{level}</p>
                  <p className="text-[#666] text-[11px]">{desc}</p>
                </div>
                <span className={`text-[20px] font-bold ${color}`}>{rate}</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-white/5">
            <p className="text-[#666] text-[11px]">No commission limit — the more you invite, the more you earn!</p>
          </div>
        </div>

        {/* Referral list */}
        <div className="bg-[#191B1F] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <p className="text-white font-medium text-[14px]">My Invitees</p>
            <span className="bg-[#6C2FE3]/20 text-[#9B6FFF] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              {referrals.length} total
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-[#555] text-[13px]">Loading...</div>
          ) : referrals.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-3">
              <Users className="w-10 h-10 text-[#333]" />
              <p className="text-[#555] text-[13px]">No invitees yet</p>
              <p className="text-[#444] text-[11px]">Share your code to start earning</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {referrals.map((r, i) => (
                <div key={r.phone} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#6C2FE3]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#9B6FFF] text-[11px] font-bold">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-white text-[13px] font-medium">{maskPhone(r.phone)}</p>
                      <p className="text-[#555] text-[10px]">Joined {formatDate(r.created_at)}</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-[11px] font-semibold">Level 1</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-[#191B1F] rounded-2xl p-4 space-y-3 mb-4">
          <p className="text-white font-medium text-[14px]">How It Works</p>
          {[
            'Share your unique code or link with friends.',
            'They register using your code on the sign-up page.',
            'You automatically earn commission on their investments.',
            'No limit — invite as many people as you want!',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#6C2FE3] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-[9px] font-bold">{i + 1}</span>
              </div>
              <p className="text-[#888] text-[12px] leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-[#191B1F] rounded-xl p-3 flex flex-col items-center gap-1.5">
      <Icon className={`w-5 h-5 ${color}`} />
      <p className={`text-[18px] font-bold ${color}`}>{value}</p>
      <p className="text-[#666] text-[10px] text-center">{label}</p>
    </div>
  );
}
