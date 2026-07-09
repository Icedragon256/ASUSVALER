import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { changePassword } from '../lib/supabase';

interface ChangePasswordPageProps {
  phone: string;
  onBack: () => void;
}

export default function ChangePasswordPage({ phone, onBack }: ChangePasswordPageProps) {
  const [form, setForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [show, setShow] = useState({ current: false, newPwd: false, confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [key]: v }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };
  const toggle = (key: keyof typeof show) => () => setShow((s) => ({ ...s, [key]: !s[key] }));

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.current) next.current = 'Please enter your current password';
    else if (form.current.length < 6) next.current = 'Password must be at least 6 characters';
    if (!form.newPwd) next.newPwd = 'Please enter a new password';
    else if (form.newPwd.length < 6) next.newPwd = 'Password must be at least 6 characters';
    if (!form.confirm) next.confirm = 'Please confirm your new password';
    else if (form.confirm !== form.newPwd) next.confirm = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    const err = await changePassword(phone, form.current, form.newPwd);
    setLoading(false);
    if (err) { setServerError(err); return; }
    setDone(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black max-w-[450px] mx-auto">
      {/* Nav */}
      <div className="w-full sticky top-0 z-10 bg-[#191B1F]">
        <div className="flex items-center h-[46px] px-4">
          <button onClick={onBack} className="mr-auto">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium text-[16px]">
            Change Password
          </span>
        </div>
      </div>

      {done ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-5 text-center">
          <CheckCircle className="w-16 h-16 text-[#00BF9A]" />
          <p className="text-white text-[20px] font-semibold">Password Changed</p>
          <p className="text-[#888] text-[13px]">Your password has been updated successfully.</p>
          <button
            onClick={onBack}
            className="mt-4 w-48 h-[44px] bg-[#4200FF] text-white text-[15px] font-medium"
          >
            Back to Profile
          </button>
        </div>
      ) : (
        <div className="flex-1 px-4 pt-6 space-y-[10px]">
          {/* Tip */}
          <div className="bg-[#1E2024] px-4 py-3 rounded mb-4">
            <p className="text-[#888] text-[12px] leading-relaxed">
              For your security, choose a strong password that is at least 6 characters long and
              includes a mix of letters, numbers, and symbols.
            </p>
          </div>

          {/* Current password */}
          <PasswordField
            label="Current Password"
            value={form.current}
            visible={show.current}
            onChange={set('current')}
            onToggle={toggle('current')}
            error={errors.current}
            placeholder="Enter current password"
          />

          {/* New password */}
          <PasswordField
            label="New Password"
            value={form.newPwd}
            visible={show.newPwd}
            onChange={set('newPwd')}
            onToggle={toggle('newPwd')}
            error={errors.newPwd}
            placeholder="Enter new password"
          />

          {/* Confirm new password */}
          <PasswordField
            label="Confirm New Password"
            value={form.confirm}
            visible={show.confirm}
            onChange={set('confirm')}
            onToggle={toggle('confirm')}
            error={errors.confirm}
            placeholder="Re-enter new password"
          />

          {/* Submit */}
          <div className="pt-6">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="w-full h-[50px] bg-[#4200FF] text-white text-[16px] font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Updating...
                </>
              ) : (
                'Confirm Change'
              )}
            </button>
            {serverError && (
              <p className="text-red-400 text-[12px] text-center mt-3">{serverError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordField({
  label,
  value,
  visible,
  onChange,
  onToggle,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  visible: boolean;
  onChange: (v: string) => void;
  onToggle: () => void;
  error?: string;
  placeholder: string;
}) {
  return (
    <div className="bg-[#1E2024] px-4 py-4">
      <p className="text-white text-[14px] mb-2">{label}</p>
      <div
        className={`flex items-center border-b pb-2 transition-colors ${
          error ? 'border-red-500' : 'border-[#444] focus-within:border-[#00BF9A]'
        }`}
      >
        <Lock className="w-4 h-4 text-[#666] mr-3 flex-shrink-0" />
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white text-[15px] placeholder-[#555] outline-none"
        />
        <button type="button" onClick={onToggle} className="ml-2 flex-shrink-0">
          {visible ? (
            <EyeOff className="w-5 h-5 text-[#666]" />
          ) : (
            <Eye className="w-5 h-5 text-[#666]" />
          )}
        </button>
      </div>
      {error && <p className="text-red-400 text-[11px] mt-1.5">{error}</p>}
    </div>
  );
}
