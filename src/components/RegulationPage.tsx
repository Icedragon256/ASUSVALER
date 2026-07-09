import { ArrowLeft, Rocket, Star } from 'lucide-react';

const PRODUCTS = [
  { vip: 'VIP1', name: 'ASUS ROG Starter',       price: '15,000',    days: 180, daily: '3,000',     total: '540,000' },
  { vip: 'VIP2', name: 'ASUS ROG Pro',            price: '30,000',    days: 180, daily: '7,000',     total: '1,260,000' },
  { vip: 'VIP3', name: 'ASUS ROG Ultra',          price: '50,000',    days: 180, daily: '12,500',    total: '2,250,000' },
  { vip: 'VIP4', name: 'ASUS ROG Strix V80',      price: '100,000',   days: 180, daily: '26,000',    total: '4,680,000' },
  { vip: 'VIP5', name: 'ASUS ROG Hyperion Z80',   price: '200,000',   days: 180, daily: '54,000',    total: '9,720,000' },
  { vip: 'VIP6', name: 'ASUS ROG Zenith Air',     price: '500,000',   days: 180, daily: '150,000',   total: '27,000,000' },
  { vip: 'VIP7', name: 'ASUS ROG Z70s Phantom',   price: '1,000,000', days: 180, daily: '320,000',   total: '57,600,000' },
  { vip: 'VIP8', name: 'ASUS ROG 5G Dominator',   price: '3,000,000', days: 180, daily: '990,000',   total: '178,200,000' },
  { vip: 'VIP9', name: 'ASUS ROG 5G Ultra Apex',  price: '5,000,000', days: 180, daily: '1,750,000', total: '315,000,000' },
];

interface RegulationPageProps {
  onBack: () => void;
}

export default function RegulationPage({ onBack }: RegulationPageProps) {
  return (
    <div className="min-h-screen bg-black text-white max-w-[450px] mx-auto flex flex-col">
      {/* Nav */}
      <div className="sticky top-0 z-20 bg-[#191B1F] border-b border-white/10">
        <div className="flex items-center h-[46px] px-4">
          <button onClick={onBack} className="mr-auto">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[16px]">
            Regulation
          </span>
        </div>
      </div>

      {/* Header banner */}
      <div className="relative overflow-hidden bg-[#6C2FE3]">
        <div className="px-5 py-6">
          <p className="text-white/90 text-[11px] tracking-widest uppercase font-semibold">ASUS VIP INVESTMENT PLAN</p>
          <h1 className="text-white text-[22px] font-bold mt-1 leading-tight">Collection Summary</h1>
          <div className="flex items-center gap-2 mt-2">
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            <span className="text-white/70 text-[12px] ml-1">Exclusive ASUS Products</span>
          </div>
        </div>
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -right-2 bottom-2 w-16 h-16 rounded-full bg-white/5" />
      </div>

      {/* Product table */}
      <div className="mx-3 mt-3 rounded-xl overflow-hidden border border-white/10">
        {/* Table header */}
        <div className="grid grid-cols-12 bg-[#6C2FE3] text-white text-[10px] font-semibold">
          <div className="col-span-4 px-2 py-2.5">Product</div>
          <div className="col-span-2 px-1 py-2.5 text-center">Price<br/>(UGX)</div>
          <div className="col-span-2 px-1 py-2.5 text-center">Days</div>
          <div className="col-span-2 px-1 py-2.5 text-center">Daily<br/>(UGX)</div>
          <div className="col-span-2 px-1 py-2.5 text-center">Total<br/>(UGX)</div>
        </div>

        {PRODUCTS.map((p, i) => (
          <div
            key={p.vip}
            className={`grid grid-cols-12 text-[10px] border-b border-white/5 last:border-0 ${
              i % 2 === 0 ? 'bg-[#111]' : 'bg-[#0d0d0d]'
            }`}
          >
            <div className="col-span-4 px-2 py-2.5 flex flex-col gap-0.5">
              <span className="bg-[#6C2BF9] text-white text-[8px] font-bold px-1.5 py-0.5 rounded w-fit">{p.vip}</span>
              <span className="text-white text-[9px] leading-tight">{p.name}</span>
            </div>
            <div className="col-span-2 px-1 py-2.5 text-center text-[#D3D3D3] self-center">{p.price}</div>
            <div className="col-span-2 px-1 py-2.5 text-center text-[#D3D3D3] self-center">{p.days}</div>
            <div className="col-span-2 px-1 py-2.5 text-center text-emerald-400 font-semibold self-center">{p.daily}</div>
            <div className="col-span-2 px-1 py-2.5 text-center text-white self-center">{p.total}</div>
          </div>
        ))}
      </div>

      {/* Tagline */}
      <div className="mx-3 mt-3 bg-[#191B1F] rounded-xl px-4 py-4 border border-[#6C2FE3]/30">
        <div className="flex items-start gap-2">
          <Rocket className="w-4 h-4 text-[#6C2FE3] flex-shrink-0 mt-0.5" />
          <p className="text-[#D3D3D3] text-[12px] leading-relaxed">
            The opportunity is here, don't hesitate! Amazing investment opportunities in Uganda!
            Strong long-term growth potential and returns!
          </p>
        </div>
      </div>

      {/* Rules list */}
      <div className="mx-3 mt-3 bg-[#191B1F] rounded-xl px-4 py-4 space-y-3 mb-8">
        {[
          { icon: '📅', label: 'Official release date', value: 'June 25th' },
          { icon: '🎁', label: 'Registration Bonus', value: 'UGX 7,000' },
          { icon: '💰', label: 'Minimum deposit', value: 'UGX 15,000' },
          { icon: '💸', label: 'Minimum withdrawal amount', value: 'UGX 7,000' },
          { icon: '🌐', label: 'Team commission', value: '35%, 2%, 1%', highlight: true },
          { icon: '🔥', label: 'No commission limit', value: 'The more you invite, the more you earn.' },
          { icon: '⚙️', label: 'Withdrawal Fee', value: '15%' },
          { icon: '🎀', label: '24/7 Withdrawals', value: 'Unlimited Time' },
        ].map(({ icon, label, value, highlight }) => (
          <div key={label} className="flex items-start gap-3">
            <span className="text-[16px] flex-shrink-0 w-5 text-center">{icon}</span>
            <div className="flex-1">
              <span className="text-[#888] text-[12px]">{label}: </span>
              <span className={`text-[12px] font-medium ${highlight ? 'text-[#6C2FE3]' : 'text-white'}`}>{value}</span>
            </div>
          </div>
        ))}

        <div className="pt-2 border-t border-white/10">
          <div className="flex items-start gap-3">
            <span className="text-[16px] flex-shrink-0 w-5 text-center">🛒</span>
            <p className="text-[#D3D3D3] text-[12px] leading-relaxed">
              Your shopping earnings will be automatically credited to your account daily, and you can withdraw them at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
