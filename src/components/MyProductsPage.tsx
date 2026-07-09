import { ArrowLeft, Info, Gift, Package } from 'lucide-react';
import type { Purchase } from '../App';

interface MyProductsPageProps {
  purchases: Purchase[];
  onBack: () => void;
}

export default function MyProductsPage({ purchases, onBack }: MyProductsPageProps) {
  const totalDailyIncome = purchases.reduce((sum, p) => {
    const n = parseInt(p.daily.replace(/,/g, ''), 10);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  return (
    <div className="min-h-screen bg-black max-w-[450px] mx-auto relative">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 w-full bg-[#191B1F] border-b border-white/5">
        <div className="flex items-center h-[46px] px-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 -ml-2 text-white z-30 relative"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="flex-1 text-center text-white font-medium text-[16px] pr-8">
            My Products
          </span>
        </div>

        <div className="bg-[#1E2024] px-4 py-3">
          <p className="flex items-center text-[13px] text-[#A7A7A7]">
            <Info className="w-4 h-4 mr-2 flex-shrink-0" />
            Product income is settled every 24 hours
          </p>
          <p className="text-[12px] text-[#A7A7A7] mt-1">
            You can purchase multiple devices to increase your income
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-[48px] h-[48px] rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center flex-shrink-0">
              <Gift className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="text-[18px] text-white font-semibold leading-tight text-center">
                UGX {totalDailyIncome.toLocaleString()}
              </div>
              <div className="text-[12px] text-[#A7A7A7] text-center">Daily Income</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-[48px] h-[48px] rounded-xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center flex-shrink-0">
              <Package className="w-7 h-7 text-[#6C2BF9]" />
            </div>
            <div>
              <div className="text-[22px] text-white font-semibold leading-tight text-center">
                {purchases.length}
              </div>
              <div className="text-[12px] text-[#A7A7A7] text-center">Total Products</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product list or empty state */}
      {purchases.length === 0 ? (
        <div className="p-8 text-center mt-8">
          <svg
            viewBox="0 0 160 160"
            className="w-[160px] h-[160px] mx-auto mb-4 opacity-40"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="mp-grad-a" x1="50%" x2="50%" y2="100%">
                <stop stopColor="#888" offset="0%" />
                <stop stopColor="#555" offset="100%" />
              </linearGradient>
              <linearGradient id="mp-grad-d" x1="64%" y1="100%" x2="64%">
                <stop stopColor="#666" offset="0%" stopOpacity="0.5" />
                <stop stopColor="#444" offset="100%" />
              </linearGradient>
              <linearGradient id="mp-grad-e" x1="64%" y1="97%" x2="64%" y2="0%">
                <stop stopColor="#666" offset="0%" stopOpacity="0.3" />
                <stop stopColor="#555" offset="100%" />
              </linearGradient>
            </defs>
            <g opacity=".8">
              <path d="M36 131V53H16v20H2v58h34z" fill="url(#mp-grad-d)" />
              <path d="M123 15h22v14h9v77h-31V15z" fill="url(#mp-grad-d)" />
            </g>
            <g opacity=".8">
              <path
                d="M87 6c3 0 7 3 8 6a8 8 0 1 1-1 16H80a7 7 0 0 1-8-6c0-4 3-7 6-7 0-5 4-9 9-9Z"
                fill="url(#mp-grad-e)"
              />
            </g>
            <g transform="translate(36 50)" fill="none">
              <g transform="translate(8)">
                <rect fill="#444" opacity=".6" x="38" y="13" width="36" height="53" rx="2" />
                <rect fill="url(#mp-grad-a)" width="64" height="66" rx="2" />
                <rect fill="#222" x="6" y="6" width="52" height="55" rx="1" />
              </g>
              <rect fill="#333" x="29" y="72" width="30" height="6" rx="1" />
            </g>
          </svg>
          <p className="text-[#A7A7A7] text-[14px]">No products yet</p>
        </div>
      ) : (
        <div className="px-4 pb-8 space-y-3">
          {purchases.map((p) => (
            <PurchaseCard key={p.id} purchase={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PurchaseCard({ purchase }: { purchase: Purchase }) {
  const date = new Date(purchase.purchased_at).toLocaleString('en-UG', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-[#757575] bg-[#0d0d0d]">
      <div className="flex items-center p-4">
        <div className="w-[90px] h-[90px] flex-shrink-0 rounded-xl overflow-hidden bg-[#111] border border-white/5">
          <img
            src={purchase.img}
            alt={purchase.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
        </div>

        <div className="flex-1 ml-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#6C2BF9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {purchase.vip}
            </span>
            <h3 className="text-white text-[13px] font-semibold leading-tight">{purchase.name}</h3>
          </div>

          <div className="space-y-1">
            <Row label="Paid" value={`UGX ${purchase.price}`} />
            <Row label="Daily income" value={`UGX ${purchase.daily}`} highlight />
            <Row label="Total revenue" value={`UGX ${purchase.total}`} />
          </div>

          <p className="text-[#555] text-[10px] mt-2">{date}</p>
        </div>
      </div>

      {/* Active badge */}
      <div className="border-t border-white/5 px-4 py-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-emerald-400 text-[11px] font-medium">Active — 180 day term</span>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-1 text-[11px]">
      <span className="text-[#A7A7A7]">{label}:</span>
      <span className={highlight ? 'text-emerald-400 font-semibold' : 'text-white'}>{value}</span>
    </div>
  );
}
