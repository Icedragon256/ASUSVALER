import { useState } from 'react';
import { ArrowLeft, ShoppingCart, CheckCircle, XCircle, Wallet } from 'lucide-react';
import type { Product } from '../App';

interface PurchaseConfirmPageProps {
  product: Product;
  balance: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PurchaseConfirmPage({ product, balance, onConfirm, onCancel }: PurchaseConfirmPageProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [declined, setDeclined] = useState(false);
  const sufficient = balance >= product.priceNum;

  const handleBuy = () => {
    if (!sufficient) {
      setDeclined(true);
      return;
    }
    setConfirmed(true);
    setTimeout(() => {
      onConfirm();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white max-w-[450px] mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-5 border-b border-white/10">
        <button onClick={onCancel} className="mr-3 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-semibold">Order Confirmation</h1>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4">
        {/* Product Card */}
        <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/10">
          <div className="flex gap-4 p-4">
            <div className="w-[90px] h-[90px] rounded-xl overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#6C2BF9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {product.vip}
                </span>
              </div>
              <p className="text-white font-semibold text-[15px] leading-tight">{product.name}</p>
              <p className="text-[#A7A7A7] text-[12px] mt-1">{product.term} term</p>
            </div>
          </div>

          <div className="border-t border-white/10 px-4 py-3 space-y-2">
            <OrderRow label="Product Price" value={`UGX ${product.price}`} />
            <OrderRow label="Daily Income" value={`UGX ${product.daily}`} highlight />
            <OrderRow label="Total Revenue" value={`UGX ${product.total}`} />
          </div>
        </div>

        {/* Balance Summary */}
        <div className="bg-[#111] rounded-2xl border border-white/10 px-4 py-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-4 h-4 text-[#6C2BF9]" />
            <span className="text-[13px] font-semibold text-white">Payment Summary</span>
          </div>
          <OrderRow label="Account Balance" value={`UGX ${balance.toLocaleString()}`} />
          <OrderRow label="Order Amount" value={`UGX ${product.price}`} />
          <div className="border-t border-white/10 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-[#A7A7A7]">Balance After Purchase</span>
              <span className={`text-[13px] font-bold ${sufficient ? 'text-emerald-400' : 'text-red-400'}`}>
                {sufficient
                  ? `UGX ${(balance - product.priceNum).toLocaleString()}`
                  : 'Insufficient'}
              </span>
            </div>
          </div>
        </div>

        {/* Insufficient funds warning */}
        {!sufficient && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 text-[13px] font-semibold">Insufficient Balance</p>
              <p className="text-red-300/70 text-[12px] mt-0.5">
                You need UGX {product.price} but only have UGX {balance.toLocaleString()}. Please recharge your account first.
              </p>
            </div>
          </div>
        )}

        {/* Decline animation */}
        {declined && !confirmed && (
          <div className="bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 flex items-center gap-3 animate-pulse">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-[13px] font-semibold">Purchase Declined — Top up your balance to proceed.</p>
          </div>
        )}

        {/* Success state */}
        {confirmed && (
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl px-4 py-3 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-emerald-400 text-[13px] font-semibold">Purchase Successful! Redirecting...</p>
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="px-4 pb-8 pt-2 space-y-3">
        <button
          onClick={handleBuy}
          disabled={confirmed}
          className={`w-full py-[14px] rounded-xl text-[15px] font-bold transition-all active:scale-95 ${
            confirmed
              ? 'bg-emerald-600/50 text-emerald-300 cursor-not-allowed'
              : sufficient
              ? 'bg-[#6C2BF9] hover:bg-[#5a20e0] text-white'
              : 'bg-red-600/80 hover:bg-red-600 text-white'
          }`}
        >
          {confirmed ? 'Processing...' : sufficient ? 'Confirm Purchase' : 'Insufficient Balance'}
        </button>
        <button
          onClick={onCancel}
          disabled={confirmed}
          className="w-full py-[14px] rounded-xl text-[15px] font-medium border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all active:scale-95"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function OrderRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[12px] text-[#A7A7A7]">{label}</span>
      <span className={`text-[13px] font-medium ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}
