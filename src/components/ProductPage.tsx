import { Home, Package, Gift, User } from 'lucide-react';
import type { Product } from '../App';

interface ProductPageProps {
  balance: number;
  purchaseCount: number;
  onHome: () => void;
  onProfile: () => void;
  onMyProducts: () => void;
  onRewards: () => void;
  onBuy: (product: Product) => void;
}

const PRODUCTS: Product[] = [
  {
    vip: 'VIP1',
    name: 'ASUS ROG Starter',
    price: '15,000',
    priceNum: 15000,
    term: '180-day',
    daily: '3,000',
    total: '540,000',
    img: '/5940438352106557392 copy copy.jpg',
  },
  {
    vip: 'VIP2',
    name: 'ASUS ROG Pro',
    price: '30,000',
    priceNum: 30000,
    term: '180-day',
    daily: '7,000',
    total: '1,260,000',
    img: '/t3qqmwxb copy copy.jpeg',
  },
  {
    vip: 'VIP3',
    name: 'ASUS ROG Ultra',
    price: '50,000',
    priceNum: 50000,
    term: '180-day',
    daily: '12,500',
    total: '2,250,000',
    img: '/asus_1xde copy.jpg',
  },
  {
    vip: 'VIP4',
    name: 'ASUS ROG Strix V80',
    price: '100,000',
    priceNum: 100000,
    term: '180-day',
    daily: '26,000',
    total: '4,680,000',
    img: '/Viewu2780S-380_6_1_1.webp',
  },
  {
    vip: 'VIP5',
    name: 'ASUS ROG Hyperion Z80',
    price: '200,000',
    priceNum: 200000,
    term: '180-day',
    daily: '54,000',
    total: '9,720,000',
    soldOut: true,
    img: '/asuas_ffbd.png',
  },
  {
    vip: 'VIP6',
    name: 'ASUS ROG Zenith Air',
    price: '500,000',
    priceNum: 500000,
    term: '180-day',
    daily: '150,000',
    total: '27,000,000',
    soldOut: true,
    img: '/Screenshot_2026-07-08_233451.png',
  },
  {
    vip: 'VIP7',
    name: 'ASUS ROG Z70s Phantom',
    price: '1,000,000',
    priceNum: 1000000,
    term: '180-day',
    daily: '320,000',
    total: '57,600,000',
    soldOut: true,
    img: '/Screenshot_2026-07-08_233335.png',
  },
  {
    vip: 'VIP8',
    name: 'ASUS ROG 5G Dominator',
    price: '3,000,000',
    priceNum: 3000000,
    term: '180-day',
    daily: '990,000',
    total: '178,200,000',
    soldOut: true,
    img: '/Screenshot_2026-07-08_233047.png',
  },
  {
    vip: 'VIP9',
    name: 'ASUS ROG 5G Ultra Apex',
    price: '5,000,000',
    priceNum: 5000000,
    term: '180-day',
    daily: '1,750,000',
    total: '315,000,000',
    soldOut: true,
    img: '/Screenshot_2026-07-08_232909.png',
  },
];

export default function ProductPage({ balance, purchaseCount, onHome, onProfile, onMyProducts, onRewards, onBuy }: ProductPageProps) {
  return (
    <div className="min-h-screen bg-black pb-[75px] relative max-w-[450px] mx-auto">
      {/* Header */}
      <div className="bg-black px-8 py-6">
        <div className="flex justify-between items-center">
          {/* My Product */}
          <button onClick={onMyProducts} className="flex items-center cursor-pointer">
            <div className="w-[48px] h-[48px] mr-3 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
              <Package className="w-7 h-7 text-[#6C2BF9]" />
            </div>
            <div className="text-white">
              <div className="text-[23px] font-bold leading-none">{purchaseCount}</div>
              <div className="text-[#A7A7A7] text-[10px] mt-1">My product &gt;</div>
            </div>
          </button>

          {/* My Income */}
          <button onClick={onMyProducts} className="flex items-center cursor-pointer">
            <div className="w-[48px] h-[48px] mr-3 rounded-xl overflow-hidden bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
              <Gift className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="text-white text-left">
              <div className="text-[19px] font-bold leading-none">0</div>
              <div className="text-[#A7A7A7] text-[10px] mt-1">My income &gt;</div>
            </div>
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3 px-4">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.vip} product={p} balance={balance} onBuy={onBuy} />
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-[#111] border-t border-white/10 flex z-30">
        <NavBtn label="Home" icon={Home} active={false} onClick={onHome} />
        <NavBtn label="Product" icon={Package} active={true} onClick={() => {}} />
        <NavBtn label="Rewards" icon={Gift} active={false} onClick={onRewards} />
        <NavBtn label="Profile" icon={User} active={false} onClick={onProfile} />
      </div>
    </div>
  );
}

function ProductCard({
  product,
  balance,
  onBuy,
}: {
  product: Product;
  balance: number;
  onBuy: (p: Product) => void;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#757575] bg-[#0d0d0d]">
      {product.soldOut && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-[#6C2BF9]/20" />
      )}

      <div className="flex items-center p-4">
        <div className="w-[110px] h-[110px] flex-shrink-0 rounded-xl overflow-hidden bg-[#111] border border-white/5">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400';
            }}
          />
        </div>

        <div className="flex-1 ml-4 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#6C2BF9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {product.vip}
            </span>
            <h3 className="text-white text-[14px] font-semibold leading-tight">{product.name}</h3>
          </div>

          <div className="space-y-1">
            <Row label="Price" value={`UGX ${product.price}`} />
            <Row label="Term" value={product.term} />
            <Row label="Daily income" value={`UGX ${product.daily}`} highlight />
            <Row label="Total revenue" value={`UGX ${product.total}`} />
          </div>

          <div className="flex justify-end mt-3">
            {product.soldOut ? (
              <button
                disabled
                className="w-[110px] h-[26px] text-[12px] rounded-lg bg-gray-700 text-gray-400 cursor-not-allowed font-medium"
              >
                Sold Out
              </button>
            ) : (
              <button
                onClick={() => onBuy(product)}
                className="w-[110px] h-[26px] text-[12px] rounded-lg bg-[#6C2BF9] text-white font-semibold hover:bg-[#5a20e0] active:scale-95 transition-all"
              >
                BUY NOW
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-1 text-[11px]">
      <span className="text-[#A7A7A7]">{label}:</span>
      <span className={highlight ? 'text-emerald-400 font-semibold' : 'text-white'}>{value}</span>
    </div>
  );
}

function NavBtn({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
        active ? 'text-white' : 'text-white/40'
      }`}
    >
      <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.6} />
      <span className="text-[11px] font-medium">{label}</span>
      {active && <span className="w-1 h-1 rounded-full bg-white" />}
    </button>
  );
}
