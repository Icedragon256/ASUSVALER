import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Package, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Purchase } from '../App';

interface PurchasesAdminPageProps {
  onBack: () => void;
}

export default function PurchasesAdminPage({ onBack }: PurchasesAdminPageProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('purchases')
      .select('*')
      .order('purchased_at', { ascending: false });
    setPurchases(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const totalRevenue = purchases.reduce((s, p) => s + p.price_num, 0);
  const uniqueUsers = new Set(purchases.map(p => p.phone)).size;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-UG', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="min-h-screen bg-black max-w-[450px] mx-auto flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#191B1F] border-b border-white/10">
        <div className="flex items-center h-[46px] px-4">
          <button onClick={onBack} className="w-10 h-10 -ml-2 flex items-center justify-center">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="flex-1 text-center text-white font-medium text-[16px] pr-8">
            Purchases Admin
          </span>
          <button onClick={load} disabled={loading} className="w-10 h-10 flex items-center justify-center">
            <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Dev badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[#6C2BF9]/10 border-t border-[#6C2BF9]/20">
          <span className="w-2 h-2 rounded-full bg-[#6C2BF9]" />
          <span className="text-[#9B6FFF] text-[11px] font-medium tracking-wide uppercase">Developer Area</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-white/5 border-b border-white/5">
        <StatBox icon={ShoppingBag} label="Total Orders" value={String(purchases.length)} color="text-[#6C2BF9]" />
        <StatBox icon={Users} label="Buyers" value={String(uniqueUsers)} color="text-blue-400" />
        <StatBox icon={TrendingUp} label="Revenue" value={`${(totalRevenue / 1000).toFixed(0)}K`} color="text-emerald-400" />
      </div>

      {/* List */}
      <div className="flex-1 px-3 py-3 space-y-3">
        {loading && purchases.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-[#444] animate-spin" />
          </div>
        )}

        {!loading && purchases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Package className="w-10 h-10 text-[#444]" />
            <p className="text-[#666] text-[14px]">No purchases yet</p>
          </div>
        )}

        {purchases.map((p) => (
          <div key={p.id} className="bg-[#111] rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <div className="w-[60px] h-[60px] rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#6C2BF9] text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                    {p.vip}
                  </span>
                  <span className="text-white text-[13px] font-semibold truncate">{p.name}</span>
                </div>
                <p className="text-emerald-400 text-[13px] font-semibold">UGX {p.price}</p>
                <p className="text-[#555] text-[10px] mt-0.5">{formatDate(p.purchased_at)}</p>
              </div>
            </div>

            <div className="border-t border-white/5 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[#666] text-[10px]">Buyer:</span>
                <span className="text-[#A7A7A7] text-[11px] font-medium">{p.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#666] text-[10px]">Daily:</span>
                <span className="text-emerald-400 text-[11px] font-semibold">+UGX {p.daily}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({
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
    <div className="bg-[#111] flex flex-col items-center justify-center py-4 gap-1">
      <Icon className={`w-5 h-5 ${color} mb-0.5`} />
      <p className={`text-[18px] font-bold ${color}`}>{value}</p>
      <p className="text-[#666] text-[10px]">{label}</p>
    </div>
  );
}
