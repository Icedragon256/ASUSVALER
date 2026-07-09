import {
  ArrowDownToLine,
  FileText,
  CheckSquare,
  Info,
  BookOpen,
  Headphones,
  Download,
  CreditCard,
  KeyRound,
  Gift,
  LogOut,
  Home,
  Package,
  User,
} from 'lucide-react';

interface ProfilePageProps {
  phone: string;
  balance: number;
  onRecharge: () => void;
  onWithdraw: () => void;
  onLogout: () => void;
  onAbout: () => void;
  onChangePassword: () => void;
  onRegulation: () => void;
  onBindBankCard: () => void;
  onRewards: () => void;
  onHome: () => void;
  onProduct: () => void;
}

const MORE_ITEMS = [
  { label: 'About us',        icon: Info },
  { label: 'Regulation',      icon: BookOpen },
  { label: 'Records',         icon: FileText },
  { label: 'Customer Service',icon: Headphones },
  { label: 'Download',        icon: Download },
  { label: 'Bind bank card',  icon: CreditCard },
  { label: 'Change Pwd',      icon: KeyRound },
  { label: 'Redeem Gift',     icon: Gift },
];

export default function ProfilePage({ phone, balance, onRecharge, onWithdraw, onLogout, onAbout, onChangePassword, onRegulation, onBindBankCard, onRewards, onHome, onProduct }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-black text-white px-[18px] pb-[90px] max-w-[450px] mx-auto relative">
      {/* Top spacer / header area */}
      <div className="px-4 py-3 mb-[45px]">
        <h1 className="text-[28px] font-bold text-left">&nbsp;</h1>
      </div>

      {/* Profile header */}
      <div className="bg-transparent">
        <div className="flex items-center">
          {/* Avatar — ASUS logo in circle */}
          <div className="w-[81px] h-[81px] bg-white rounded-full overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
            <img
              src="/asus_logos.jpeg"
              alt="ASUS"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Phone + level */}
          <div className="ml-[14px] text-left flex-none">
            <p className="text-[18px] mb-0.5">{phone}</p>
            <span className="inline-block px-6 py-0.5 bg-[#6C2FE3] text-white text-[12px] rounded-full">
              Lv1
            </span>
          </div>

          {/* Exit button */}
          <button
            onClick={onLogout}
            className="flex flex-col items-center ml-auto mr-[10px]"
          >
            <LogOut className="w-[25px] h-[25px] text-white" />
            <span className="text-[11px] mt-1">Exit</span>
          </button>
        </div>

        {/* Balance card */}
        <div className="px-[6px] mt-[40px] h-[68px]">
          <div className="bg-[#6C2FE3] rounded-lg p-2 h-full">
            <div className="flex justify-between items-center h-full">
              <div className="text-left text-white">
                <p className="text-[12px]">Account Balance</p>
                <p className="text-[25px] leading-none">{balance.toLocaleString()}</p>
              </div>
              <button
                onClick={onRecharge}
                className="bg-transparent text-[#F2F5FE] px-4 py-2 rounded-full text-[11px] border border-[#F2F5FE]"
              >
                Recharge &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-[#191B1F] rounded-lg shadow-sm mt-4">
        <div className="grid grid-cols-3">
          {[
            { label: 'Withdrawal', Icon: ArrowDownToLine, action: onWithdraw },
            { label: 'Records',    Icon: FileText,        action: undefined },
            { label: 'Check-in',   Icon: CheckSquare,     action: undefined },
          ].map(({ label, Icon, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-center py-4 hover:bg-white/5 active:scale-95 transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center pt-[12px]">
                <Icon className="w-[30px] h-[30px] text-white" strokeWidth={1.4} />
              </div>
              <span className="text-[11px] text-white pt-[6px] pb-[6px]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* My products banner */}
      <div className="mt-[8px]">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src="/asus_logos.jpeg"
            alt="My products"
            className="w-full h-[80px] object-cover object-center brightness-50"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <div className="text-white text-[18px] break-words">My products</div>
            <div className="text-white text-[14px] break-words mt-2 leading-[18px]">
              Buy more devices, earn more income
            </div>
          </div>
        </div>
      </div>

      {/* More section */}
      <div className="mt-[8px]">
        <div className="bg-[#191B1F] rounded-lg shadow-sm">
          <h2 className="text-[15px] font-[400] mb-[11px] text-left pl-[20px] pt-[17px]">More</h2>
          <div className="grid grid-cols-4 pb-2">
            {MORE_ITEMS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={label === 'About us' ? onAbout : label === 'Change Pwd' ? onChangePassword : label === 'Regulation' ? onRegulation : label === 'Bind bank card' ? onBindBankCard : undefined}
                className="flex flex-col items-center py-2 hover:bg-white/5 active:scale-95 transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center pt-[12px]">
                  <Icon className="w-[30px] h-[30px] text-white" strokeWidth={1.4} />
                </div>
                <span className="text-[12px] text-white pt-[6px] pb-[6px] text-center leading-tight px-1">
                  {label}
                </span>
              </button>
            ))}
          </div>
          <div className="h-[30px]" />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-[#111] border-t border-white/10 flex z-30">
        <button onClick={onHome} className="flex-1 flex flex-col items-center gap-1 py-3 text-white/40 transition-colors">
          <Home className="w-5 h-5" strokeWidth={1.6} />
          <span className="text-[11px] font-medium">Home</span>
        </button>
        <button onClick={onProduct} className="flex-1 flex flex-col items-center gap-1 py-3 text-white/40 transition-colors">
          <Package className="w-5 h-5" strokeWidth={1.6} />
          <span className="text-[11px] font-medium">Product</span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1 py-3 text-white/40 transition-colors" onClick={onRewards}>
          <Gift className="w-5 h-5" strokeWidth={1.6} />
          <span className="text-[11px] font-medium">Rewards</span>
        </button>
        <button className="flex-1 flex flex-col items-center gap-1 py-3 text-emerald-400 transition-colors">
          <User className="w-5 h-5" strokeWidth={2.2} />
          <span className="text-[11px] font-medium">Profile</span>
          <span className="w-1 h-1 rounded-full bg-emerald-400" />
        </button>
      </div>
    </div>
  );
}
