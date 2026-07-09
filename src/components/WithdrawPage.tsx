import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronDown, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const QUICK_AMOUNTS = [15000, 30000, 50000, 100000];

const RECORDS_ICON =
  'data:image/png;base64,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';

const MOBILE_MONEY_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAApCAMAAACiLJGiAAAAAXNSR0IArs4c6QAAADBQTFRFR3BM////////////////////////////////////////////////////////////RD7sAgAAAA90Uk5TAPX6H5vK46ulDW9GLYVZnaRKTQAAAO9JREFUeNrd1s1ORCEMhuF+hZbDb+//bhWJMZgZh55EFz77N5CWBfShjShHUmmZljySgo9ApQSaQle2cxrbiswFsVEeaj6snVpic2fU1dxAyncq2H+smEQZblRLdOtEObhl+kM3b1j75RZJwF4Awfi33gZjYl+lKU5JPRV6y1OIcFTaaKlypxrqqBBrm2qCozJIencJHkwDugHbF54e7Is1lk0Xfr1l9JB3VV9XWuibICdnZdr9dNbn7VlK3YwLz6sutjB0x/a8ahfMSygPMZc1uFzUGfUwJ1wEdoxnNOUaFYc0jUy0hNGvdOCK67/xBhuYVb/JTNJiAAAAAElFTkSuQmCC';

interface SavedAccount {
  id: string;
  account_number: string;
  account_name: string;
}

interface WithdrawPageProps {
  phone: string;
  balance: number;
  onBack: () => void;
}

export default function WithdrawPage({ phone, balance, onBack }: WithdrawPageProps) {
  const [amount, setAmount] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [manualNumber, setManualNumber] = useState('');
  const [manualName, setManualName] = useState('');
  const [useManual, setUseManual] = useState(false);

  useEffect(() => {
    supabase
      .from('saved_accounts')
      .select('id, account_number, account_name')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const list = data ?? [];
        setSavedAccounts(list);
        if (list.length > 0) setSelectedId(list[0].id);
        else setUseManual(true);
      });
  }, [phone]);

  const selected = savedAccounts.find(a => a.id === selectedId);

  const walletNumber = useManual ? manualNumber : (selected?.account_number ?? '');
  const walletName   = useManual ? manualName   : (selected?.account_name ?? '');
  const isValid = Number(amount) >= 7000 && walletNumber.trim().length >= 9 && walletName.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-black max-w-[450px] mx-auto">
      {/* Nav Bar */}
      <div className="w-full sticky top-0 z-10 bg-[#191B1F]">
        <div className="flex items-center h-[46px] px-4">
          <button onClick={onBack} className="flex items-center justify-center mr-auto">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[16px]">
            Withdrawal
          </span>
          <button className="ml-auto">
            <img src={RECORDS_ICON} alt="Records" className="w-6 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Balance Row */}
      <div className="w-full mt-[10px]">
        <div className="flex items-center bg-[#1E2024] px-4 py-3">
          <span className="text-[#D3D3D3] text-[16px] mr-2">Available Balance</span>
          <span className="text-white text-[18px]">{balance.toLocaleString()}</span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="px-4 mt-[10px] bg-[#1E2024]">
        <div className="mt-[18px]">
          <p className="text-white text-[18px] font-[400] text-left mb-[10px]">Amount</p>
          <div className="relative">
            <span className="absolute top-1/2 -translate-y-1/2 text-white text-[31px] left-4">UGX</span>
            <input
              type="number"
              className="w-full h-10 pl-[100px] pr-4 bg-transparent border-0 rounded-none border-b border-gray-200 focus:outline-none focus:border-[#00BF9A] transition-colors text-white text-[22px]"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-[10px] mb-[20px]">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              onClick={() => setAmount(String(val))}
              className={`flex items-center justify-center h-[42px] border transition-all duration-200 ${
                amount === String(val) ? 'border-[#00BF9A] text-[#00BF9A]' : 'border-[#FFF] bg-transparent text-[#FFF]'
              }`}
            >
              <span className="text-[11px]">{val.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Account Selector */}
      <div className="mt-[10px] bg-[#1E2024] px-4 py-4">
        <p className="text-white text-[16px] text-left mb-3">Withdrawal Account</p>

        {savedAccounts.length > 0 && (
          <>
            {/* Saved accounts toggle */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setUseManual(false)}
                className={`flex-1 h-9 text-[13px] rounded-lg border transition-colors ${
                  !useManual ? 'border-[#6C2FE3] bg-[#6C2FE3]/15 text-[#9B6FFF]' : 'border-[#444] text-[#888]'
                }`}
              >
                Saved Accounts
              </button>
              <button
                onClick={() => setUseManual(true)}
                className={`flex-1 h-9 text-[13px] rounded-lg border transition-colors ${
                  useManual ? 'border-[#6C2FE3] bg-[#6C2FE3]/15 text-[#9B6FFF]' : 'border-[#444] text-[#888]'
                }`}
              >
                Enter Manually
              </button>
            </div>

            {/* Dropdown */}
            {!useManual && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(s => !s)}
                  className="w-full flex items-center justify-between px-3 h-11 bg-[#111] border border-[#333] rounded-lg text-white"
                >
                  <div className="text-left">
                    <p className="text-[14px] font-medium">{selected?.account_number ?? 'Select account'}</p>
                    {selected && <p className="text-[11px] text-[#888]">{selected.account_name}</p>}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[#888] flex-shrink-0 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showDropdown && (
                  <div className="absolute left-0 right-0 mt-1 bg-[#1E2024] border border-[#333] rounded-lg overflow-hidden z-20 shadow-xl">
                    {savedAccounts.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => { setSelectedId(a.id); setShowDropdown(false); }}
                        className="w-full flex items-center justify-between px-3 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                      >
                        <div className="text-left">
                          <p className="text-white text-[14px] font-medium">{a.account_number}</p>
                          <p className="text-[#888] text-[11px]">{a.account_name}</p>
                        </div>
                        {selectedId === a.id && <CheckCircle2 className="w-4 h-4 text-[#6C2FE3] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Manual entry */}
        {(useManual || savedAccounts.length === 0) && (
          <div className="space-y-3">
            <div>
              <p className="text-[#D3D3D3] text-[13px] mb-1">Mobile Money / Bank Number</p>
              <input
                type="tel"
                className="w-full h-10 px-4 bg-transparent border-0 rounded-none border-b border-gray-200 focus:outline-none focus:border-[#00BF9A] transition-colors text-white text-[16px]"
                placeholder="e.g. 0771234567"
                value={manualNumber}
                onChange={(e) => setManualNumber(e.target.value)}
              />
            </div>
            <div>
              <p className="text-[#D3D3D3] text-[13px] mb-1">Account Holder Name</p>
              <input
                type="text"
                className="w-full h-10 px-4 bg-transparent border-0 rounded-none border-b border-gray-200 focus:outline-none focus:border-[#00BF9A] transition-colors text-white text-[16px]"
                placeholder="Full name"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Withdrawal Method */}
      <div className="mt-[10px] bg-[#1E2024] px-4 py-4">
        <p className="text-white text-[16px] text-left mb-[10px]">Withdrawal method</p>
        <button className="w-full flex items-center px-4 h-[44px] bg-[#4200FF] text-white">
          <div className="w-[18px] h-[18px] flex-shrink-0 mr-3">
            <img src={MOBILE_MONEY_ICON} className="w-full h-full object-contain" alt="Mobile Money" />
          </div>
          <span className="flex-1 text-left text-[19px]">Mobile Money</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white flex-shrink-0">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </button>
      </div>

      {/* Confirm Button */}
      <div className="mt-4 mb-4 flex justify-center">
        <button
          disabled={!isValid}
          className="w-60 h-[48px] bg-[#4200FF] text-white text-[20px] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Confirm
        </button>
      </div>

      <div className="text-center mb-4">
        <a href="#" className="text-[#F00E57] text-[14px] font-[500]">Withdrawal problem? Click here</a>
      </div>

      <div className="mt-2 px-4 pb-6">
        <div className="text-[12px] text-[#D3D3D3] text-left space-y-1">
          <p>1. The minimum withdrawal amount is UGX 7,000.</p>
          <p>2. Ensure the mobile money or bank number is correct before confirming.</p>
          <p>3. The account holder name must match the registered wallet name.</p>
          <p>4. Withdrawals are processed within 5–30 minutes. Contact support if delayed.</p>
        </div>
      </div>
    </div>
  );
}
