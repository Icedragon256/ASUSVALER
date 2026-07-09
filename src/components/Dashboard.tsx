import { useState } from 'react';
import {
  RefreshCw,
  ArrowDownToLine,
  HelpCircle,
  CheckSquare,
  Bell,
  Home,
  BarChart2,
  Gift,
  User,
  ChevronRight,
  ClipboardList,
  Package,
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  onRecharge: () => void;
  onWithdraw: () => void;
  onPayments: () => void;
  onProfile: () => void;
  onProduct: () => void;
  onPurchasesAdmin: () => void;
  onRewards: () => void;
}

const TICKER_ITEMS = [
  '******3194 Recharge 15,000',
  '******8343 Recharge 100,000',
  '******3985 Recharge 50,000',
  '******7909 Recharge 100,000',
  '******8818 Recharge 15,000',
  '******6530 Recharge 15,000',
  '******7303 Recharge 100,000',
  '******2878 Recharge 30,000',
  '******3694 Recharge 30,000',
  '******0791 Recharge 50,000',
  '******6888 Recharge 50,000',
  '******5113 Recharge 100,000',
];

const QUICK_ACTIONS = [
  { label: 'Recharge', icon: RefreshCw, color: 'text-emerald-400' },
  { label: 'Withdrawal', icon: ArrowDownToLine, color: 'text-blue-400' },
  { label: 'Help', icon: HelpCircle, color: 'text-yellow-400' },
  { label: 'Check in', icon: CheckSquare, color: 'text-rose-400' },
];

const NAV_ITEMS = [
  { label: 'Home', icon: Home },
  { label: 'Product', icon: BarChart2 },
  { label: 'Rewards', icon: Gift },
  { label: 'Profile', icon: User },
];

export default function Dashboard({ onLogout, onRecharge, onWithdraw, onPayments, onProfile, onProduct, onPurchasesAdmin, onRewards }: DashboardProps) {
  const [activeNav, setActiveNav] = useState(0);
  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Banner */}
      <div className="relative w-full h-[220px] flex-shrink-0">
        <img
          src="/asus_logos.jpeg"
          alt="Banner"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span className="text-black font-bold text-xs">A</span>
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">ASUS</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onPayments}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Payment Submissions"
            >
              <ClipboardList className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={onPurchasesAdmin}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Purchases Admin"
            >
              <Package className="w-5 h-5 text-white" />
            </button>
            <button className="relative p-2" onClick={onLogout}>
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-400 rounded-full" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Card — overlaps banner */}
      <div className="mx-3 -mt-12 relative z-10 bg-black/85 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl">
        <div className="grid grid-cols-4">
          {QUICK_ACTIONS.map(({ label, icon: Icon, color }) => (
            <button
              key={label}
              onClick={label === 'Recharge' ? onRecharge : label === 'Withdrawal' ? onWithdraw : undefined}
              className="flex flex-col items-center gap-2 py-4 px-2 hover:bg-white/5 transition-colors rounded-xl active:scale-95"
            >
              <div className={`w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center ${color}`}>
                <Icon className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <span className="text-[12px] text-white/90 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Ticker / notification bar */}
      <div className="mx-3 mt-3 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 border border-white/8 overflow-hidden">
        <Bell className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <div className="flex-1 overflow-hidden">
          <div className="ticker-track whitespace-nowrap text-[12px] text-white/80">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].join('   •   ')}
          </div>
        </div>
      </div>

      {/* Overview Card */}
      <div className="mx-3 mt-3 rounded-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="bg-[#6C2FE3] px-4 py-2.5">
          <span className="text-white text-[17px] font-semibold">Overview</span>
        </div>

        <div className="bg-[#191A1F] p-4">
          <div className="grid grid-cols-12 gap-3">
            {/* Balance — spans all 3 right rows */}
            <div className="col-span-7 row-span-3 relative rounded-xl overflow-hidden" style={{ minHeight: 240 }}>
              <img
                src="/5940438352106557392.jpg"
                alt="Balance"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <span className="text-white text-[28px] font-bold leading-none">7,200</span>
                <span className="text-white/80 text-[16px] mt-1">Balance</span>
              </div>
            </div>

            {/* Cumulative */}
            <div className="col-span-5 relative rounded-xl overflow-hidden h-[72px]">
              <img src="/t3qqmwxb.jpeg" alt="Cumulative" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <span className="text-white text-[18px] font-bold leading-none">7,200</span>
                <span className="text-white/80 text-[12px] mt-0.5">Cumulative</span>
              </div>
            </div>

            {/* Withdrawal */}
            <div className="col-span-5 relative rounded-xl overflow-hidden h-[72px]">
              <img
                src="https://images.pexels.com/photos/5980856/pexels-photo-5980856.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Withdrawal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <span className="text-white text-[18px] font-bold leading-none">0</span>
                <span className="text-white/80 text-[12px] mt-0.5">Withdrawal</span>
              </div>
            </div>

            {/* Mission — same right column, third row */}
            <div className="col-span-5 relative rounded-xl overflow-hidden h-[72px]">
              <img
                src="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Mission"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute inset-0 px-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-semibold text-[12px]">Our Mission</div>
                  <div className="text-white/70 text-[9px]">Get more rewards</div>
                </div>
                <button className="bg-white text-black text-[10px] font-bold rounded-full px-3 py-1 hover:bg-emerald-400 transition-colors active:scale-95">
                  GO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mx-3 mt-3 rounded-2xl bg-[#191A1F] border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold text-[15px]">Recent Activity</span>
          <button className="text-emerald-400 text-[12px]">View all</button>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Recharge', amount: '+15,000', date: 'Today 09:14', color: 'text-emerald-400' },
            { label: 'Mission Reward', amount: '+2,500', date: 'Yesterday 18:30', color: 'text-emerald-400' },
            { label: 'Withdrawal', amount: '-7,000', date: 'Jun 30 11:00', color: 'text-red-400' },
          ].map((item) => (
            <div key={item.label + item.date} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <div className="text-white text-[13px] font-medium">{item.label}</div>
                <div className="text-white/40 text-[11px] mt-0.5">{item.date}</div>
              </div>
              <span className={`text-[14px] font-semibold ${item.color}`}>{item.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Check-in prompt */}
      {!checkedIn && (
        <div className="mx-3 mt-3 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/20 p-4 flex items-center justify-between">
          <div>
            <div className="text-white font-semibold text-[14px]">Daily Check-in</div>
            <div className="text-white/50 text-[12px] mt-0.5">Claim your daily reward</div>
          </div>
          <button
            onClick={() => setCheckedIn(true)}
            className="bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-sm rounded-full px-5 py-1.5 hover:brightness-110 active:scale-95 transition-all"
          >
            Check in
          </button>
        </div>
      )}
      {checkedIn && (
        <div className="mx-3 mt-3 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 p-4 text-center">
          <span className="text-emerald-400 font-semibold text-[14px]">Checked in today! Come back tomorrow.</span>
        </div>
      )}

      {/* Spacer for bottom nav */}
      <div className="h-24" />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#111] border-t border-white/10 flex z-30">
        {NAV_ITEMS.map(({ label, icon: Icon }, i) => (
          <button
            key={label}
            onClick={() => {
              if (label === 'Profile') { onProfile(); return; }
              if (label === 'Product') { onProduct(); return; }
              if (label === 'Rewards') { onRewards(); return; }
              setActiveNav(i);
            }}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeNav === i ? 'text-emerald-400' : 'text-white/40'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={activeNav === i ? 2.2 : 1.6} />
            <span className="text-[11px] font-medium">{label}</span>
            {activeNav === i && <span className="w-1 h-1 rounded-full bg-emerald-400" />}
          </button>
        ))}
      </div>
    </div>
  );
}
