import { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle, Copy, Check, Camera, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

// ── Developer-only settings ────────────────────────────────────────────
// Edit SEND_TO_NUMBER and ACCOUNT_NAME here; users see them read-only.
const SEND_TO_NUMBER = '0772000000';
const ACCOUNT_NAME = 'John Doe';
// ──────────────────────────────────────────────────────────────────────

const QUICK_AMOUNTS = [15000, 30000, 50000, 100000];

const RECORDS_ICON =
  'data:image/png;base64,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';

const BALANCE_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAzCAYAAAAn3w6xAAAAAXNSR0IArs4c6QAAAy9JREFUaEPtm8urzVEUxz/L+53HAEkRRWJAIiND4i9QomugvJUJIUUmJPIYSMhAMjIQJTFQUiKugYHUvZJXca9nXBfb73vaVz/n7t9xbkb799u7Trfu2YO9Pnuttff+rnUMwDnXD5gELAGWA7OA4fouI/ELeAQcB26a2feQLeac6w/MBNYBy4DxwLCIDc8v/RtwC9gGPDYzQflrCMBkYCewAhhVEsPzZrwC9gLnzOxrCMBaYAcwpYTGy6QO4BhwyMw+hQBcAxYDg0sK4IMHcKAIwDtgbJ3xDlD8KHFY5GDeAyczG4+a2eeQB8gtRtR9of9d8llUMGKGUAXcA+6bWXcIgFykPvm9AbYACg8BiHlo/V1mJhC9hk6BIgAbgSvAz5atz60978XdPUdiEQCFwAXgQQk8IL9/uvDpLvASeAi8KAKgSfKMXudm5N4gL1BIyK472W33YBGAyO1savmdwMUqAxClZ1UH0Fl1AB0JQME9oKksUoJJyQNSCKQQCL8FShDeTZmQckDKASkHlCsH/AD00bN3UBNZoDQ5QFJXu7R/4LUv6swApgNjGoAoBQBpFzeAI177k5ArD1CBpwVYCUwo0DWjByC5ToLnBqDVzOT+f4ZzToZL2tuc1QVGBjwhegDPs5jfBZw3s17apXNOCtBc4ASwwHtGnkP0ALT7q81MsR8c3gt2+3AYWjcpagDS9m4Dq8ysrQGAccBW/6mvf0QNQDZLtW4xs9YGACYC+3wyrC//RQ9A8raMOxOq//scMB84DcwOnATRA9AR+ARYL5nbzFTPrA3f96DS/3blCWBIGU+Bmq1ZY8dd4KzX+r8AA7J+gKm+50EdLyr+huqb0XtAz6bKE6Tz61hUXVPtPdO84Y3K/qUB0MS1PzglAUh6QNIDyqUH9DUXpByQckDKAc59LBAL+hpPMc6v5QDdoEbHuPr/XLOu0O0CoHv0vOxVpabpKg29Ga4KgBqlN3kRsUoAnqpHWgDmAPuBpdnfgRUhoN1XG+AeAVABYZF/Ny/8h44eOx/F/VvgOnBYilLtjeyc087LE9b4H03oORl7i2xos5TwL2e/jjmViSRtktF/A9rWdwl1+IWcAAAAAElFTkSuQmCC';

const NETWORKS = [
  { id: 'mtn', label: 'MTN Mobile Money', color: '#FFCC00', textColor: '#000' },
  { id: 'airtel', label: 'Airtel Money', color: '#FF0000', textColor: '#FFF' },
];

const CHECKOUT_API = 'https://sdk.gopayug.com/api/v1/checkout';

interface RechargePageProps {
  onBack: () => void;
}

export default function RechargePage({ onBack }: RechargePageProps) {
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('mtn');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofDone, setProofDone] = useState(false);
  const [proofError, setProofError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const clearError = () => setError('');
  const isValid = Number(amount) >= 15000;

  const handleCopy = () => {
    navigator.clipboard.writeText(SEND_TO_NUMBER).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const clearScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleProofSubmit = async () => {
    if (!isValid) return;
    setProofSubmitting(true);
    setProofError('');
    try {
      let screenshotUrl: string | null = null;
      if (screenshot) {
        const filename = `${Date.now()}-${screenshot.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(filename, screenshot);
        if (uploadError) throw uploadError;
        screenshotUrl = supabase.storage
          .from('payment-screenshots')
          .getPublicUrl(filename).data.publicUrl;
      }
      const { error: insertError } = await supabase
        .from('payment_submissions')
        .insert({ amount: Number(amount), network, screenshot_url: screenshotUrl });
      if (insertError) throw insertError;
      setProofDone(true);
    } catch {
      setProofError('Submission failed. Please try again.');
    } finally {
      setProofSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    if (!isValid) return;
    setLoading(true);
    setError('');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(CHECKOUT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(amount),
          currency: 'UGX',
          network,
          send_to: SEND_TO_NUMBER,
          account_name: ACCOUNT_NAME,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('gateway_error');
      const data = await res.json();
      const redirectUrl = data?.checkout_url || data?.url || data?.redirect_url;
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Payment system updating. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-black max-w-[450px] mx-auto items-center justify-center px-8 text-center gap-6">
        <CheckCircle className="w-16 h-16 text-[#00BF9A]" />
        <div>
          <p className="text-white text-[22px] font-semibold mb-2">Check Your Phone</p>
          <p className="text-[#D3D3D3] text-[14px] leading-relaxed">
            Your deposit of{' '}
            <span className="text-white font-medium">UGX {Number(amount).toLocaleString()}</span>{' '}
            has been sent to <span className="text-white font-medium">{SEND_TO_NUMBER}</span>.
          </p>
        </div>
        <p className="text-[#D3D3D3] text-[12px]">Please wait 5–30 minutes for your balance to update.</p>
        <button
          onClick={onBack}
          className="mt-4 w-48 h-[44px] bg-[#4200FF] text-white text-[16px]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black max-w-[450px] mx-auto">
      {/* Nav Bar */}
      <div className="w-full sticky top-0 z-10">
        <div
          className="flex items-center h-[46px] px-4"
          style={{ backgroundColor: 'rgb(25, 27, 31)' }}
        >
          <button onClick={onBack} className="flex items-center justify-center mr-auto">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[16px]">
            Recharge
          </span>
          <button className="ml-auto">
            <img src={RECORDS_ICON} alt="Records" className="w-6 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Balance Row */}
      <div className="w-full mt-[10px] pt-[36px]">
        <div className="flex items-center bg-[#1E2024] px-4 py-3">
          <img src={BALANCE_ICON} alt="Balance" className="w-6 mr-3" />
          <div className="flex items-center">
            <span className="text-[#D3D3D3] text-[16px] mr-2">Balance</span>
            <span className="text-white text-[18px]">7,200</span>
          </div>
        </div>
      </div>

      {/* Amount Input */}
      <div className="px-4 mt-[10px] bg-[#1E2024]">
        <div className="mt-[18px]">
          <p className="text-white text-[18px] font-[400] text-left mb-[10px]">Amount</p>
          <div className="relative">
            <span className="absolute top-1/2 -translate-y-1/2 text-white text-[31px] left-4">
              UGX
            </span>
            <input
              type="number"
              className="w-full h-10 pl-[100px] pr-4 bg-transparent border-0 rounded-none border-b border-gray-200 focus:outline-none focus:border-[#00BF9A] transition-colors text-white text-[22px]"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); clearError(); }}
            />
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-[10px] mb-[20px]">
          {QUICK_AMOUNTS.map((val) => (
            <button
              key={val}
              onClick={() => { setAmount(String(val)); clearError(); }}
              className={`relative flex items-center justify-center h-[42px] border transition-all duration-200 ${
                amount === String(val)
                  ? 'border-[#00BF9A] text-[#00BF9A]'
                  : 'border-[#FFF] bg-transparent text-[#FFF]'
              }`}
            >
              <span className="text-[11px]">{val.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Network Selector */}
      <div className="mt-[10px] bg-[#1E2024] px-4 py-4">
        <p className="text-white text-[16px] text-left mb-[10px]">Mobile Network</p>
        <div className="grid grid-cols-2 gap-3">
          {NETWORKS.map((n) => (
            <button
              key={n.id}
              onClick={() => setNetwork(n.id)}
              className={`h-[44px] flex items-center justify-center gap-2 border-2 transition-all duration-200 text-[14px] font-medium ${
                network === n.id
                  ? 'border-[#00BF9A] bg-[#00BF9A]/10 text-white'
                  : 'border-[#444] bg-transparent text-[#aaa]'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: n.color }}
              />
              {n.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Send Funds To (read-only + copy) */}
      <div className="mt-[10px] bg-[#1E2024] px-4 py-4">
        <p className="text-white text-[16px] text-left mb-[3px]">Send Funds To</p>
        <p className="text-[#888] text-[11px] mb-[10px]">
          {NETWORKS.find((n) => n.id === network)?.label} receiving number
        </p>
        <div className="flex items-center gap-3 border-b border-gray-600 pb-3">
          <span className="flex-1 text-[#00BF9A] text-[22px] font-semibold tracking-widest select-all">
            {SEND_TO_NUMBER}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 h-9 rounded transition-all duration-200 text-[13px] font-medium ${
              copied
                ? 'bg-[#00BF9A]/20 text-[#00BF9A] border border-[#00BF9A]/40'
                : 'bg-[#4200FF]/20 text-[#9b7fff] border border-[#4200FF]/40 hover:bg-[#4200FF]/30'
            }`}
          >
            {copied ? (
              <><Check className="w-4 h-4" /> Copied</>
            ) : (
              <><Copy className="w-4 h-4" /> Copy</>
            )}
          </button>
        </div>
      </div>

      {/* Account Name (read-only) */}
      <div className="mt-[10px] bg-[#1E2024] px-4 py-4">
        <p className="text-white text-[16px] text-left mb-[3px]">Account Name</p>
        <p className="text-[#888] text-[11px] mb-[10px]">Name the Mobile Money line is registered in</p>
        <span className="text-[#00BF9A] text-[22px] font-semibold tracking-widest">{ACCOUNT_NAME}</span>
      </div>

      {/* Confirm Button */}
      <div className="mt-6 mb-2 flex justify-center">
        <button
          disabled={!isValid || loading}
          onClick={handleConfirm}
          className="w-60 h-[48px] bg-[#4200FF] text-white text-[20px] disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending prompt...
            </>
          ) : 'Confirm'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-3 rounded-lg bg-red-900/40 border border-red-500/40 text-red-300 text-[13px] text-center">
          {error}
        </div>
      )}

      {/* Proof of Payment Submission */}
      <div className="mt-[10px] mx-0 bg-[#1E2024] px-4 py-5">
        {proofDone ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle className="w-10 h-10 text-[#00BF9A]" />
            <p className="text-white text-[16px] font-semibold">Proof Submitted!</p>
            <p className="text-[#888] text-[12px] text-center">
              Your payment of UGX {Number(amount).toLocaleString()} has been recorded.<br />
              We will verify and update your balance shortly.
            </p>
          </div>
        ) : (
          <>
            <p className="text-white text-[16px] mb-1">Already Paid?</p>
            <p className="text-[#888] text-[11px] mb-4">
              After sending money to the number above, confirm your payment here. Screenshot is optional.
            </p>

            {/* Screenshot Upload */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {screenshotPreview ? (
              <div className="relative mb-4">
                <img
                  src={screenshotPreview}
                  alt="Payment screenshot"
                  className="w-full max-h-52 object-contain rounded border border-[#444]"
                />
                <button
                  onClick={clearScreenshot}
                  className="absolute top-2 right-2 bg-black/70 rounded-full p-1"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-[72px] border border-dashed border-[#555] flex flex-col items-center justify-center gap-1.5 mb-4 hover:border-[#00BF9A] transition-colors"
              >
                <Camera className="w-5 h-5 text-[#888]" />
                <span className="text-[#888] text-[12px]">Tap to upload screenshot (optional)</span>
              </button>
            )}

            {proofError && (
              <p className="text-red-400 text-[12px] mb-3 text-center">{proofError}</p>
            )}

            <button
              disabled={!isValid || proofSubmitting}
              onClick={handleProofSubmit}
              className="w-full h-[48px] bg-[#00BF9A] text-black font-semibold text-[16px] disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {proofSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <><Check className="w-4 h-4" /> I've Sent the Payment</>
              )}
            </button>
          </>
        )}
      </div>

      {/* Recharge Problem Link */}
      <div className="text-center mb-4 mt-2">
        <a href="#" className="text-[#F00E57] text-[14px] font-[500]">
          Long delay in recharge? Click here
        </a>
      </div>

      {/* Notes */}
      <div className="mt-2 px-4 pb-6">
        <div className="text-[12px] text-[#D3D3D3] text-left space-y-1">
          <p>1. The minimum recharge amount is UGX 15,000.</p>
          <p>2. Enter the correct Mobile Money number — a payment prompt will be sent to it.</p>
          <p>3. Approve the prompt on your phone to complete the transaction.</p>
          <p>4. Please wait 5–30 minutes after approving for your balance to update.</p>
        </div>
      </div>
    </div>
  );
}
