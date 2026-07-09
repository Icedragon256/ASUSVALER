import { useState, FormEvent } from 'react';
import { loginUser, registerUser } from '../lib/supabase';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Loader2,
  ChevronDown,
  Gift,
} from 'lucide-react';

type Mode = 'login' | 'register';

const COUNTRY_CODES = [
  { code: '+256', label: 'Uganda', flag: 'UG' },
  { code: '+1', label: 'US/Canada', flag: 'US' },
  { code: '+44', label: 'United Kingdom', flag: 'GB' },
  { code: '+234', label: 'Nigeria', flag: 'NG' },
  { code: '+233', label: 'Ghana', flag: 'GH' },
  { code: '+27', label: 'South Africa', flag: 'ZA' },
  { code: '+254', label: 'Kenya', flag: 'KE' },
  { code: '+250', label: 'Rwanda', flag: 'RW' },
  { code: '+257', label: 'Burundi', flag: 'BI' },
  { code: '+250', label: 'Rwanda', flag: 'RW' },
  { code: '+255', label: 'Tanzania', flag: 'TZ' },
  { code: '+260', label: 'Zambia', flag: 'ZM' },
  { code: '+263', label: 'Zimbabwe', flag: 'ZW' },
  { code: '+264', label: 'Namibia', flag: 'NA' },
  { code: '+265', label: 'Malawi', flag: 'MW' },
  { code: '+267', label: 'Botswana', flag: 'BW' },
  { code: '+268', label: 'Eswatini', flag: 'SZ' },
  { code: '+290', label: 'Saint Helena', flag: 'SH' },
  { code: '+291', label: 'Eritrea', flag: 'ER' },
  { code: '+231', label: 'Liberia', flag: 'LR' },
  { code: '+232', label: 'Sierra Leone', flag: 'SL' },
  { code: '+220', label: 'Gambia', flag: 'GM' },
  { code: '+221', label: 'Senegal', flag: 'SN' },
  { code: '+222', label: 'Mauritania', flag: 'MR' },
  { code: '+223', label: 'Mali', flag: 'ML' },
  { code: '+224', label: 'Guinea', flag: 'GN' },
  { code: '+225', label: "Côte d'Ivoire", flag: 'CI' },
  { code: '+226', label: 'Burkina Faso', flag: 'BF' },
  { code: '+227', label: 'Niger', flag: 'NE' },
  { code: '+228', label: 'Togo', flag: 'TG' },
  { code: '+229', label: 'Benin', flag: 'BJ' },
  { code: '+240', label: 'Equatorial Guinea', flag: 'GQ' },
  { code: '+241', label: 'Gabon', flag: 'GA' },
  { code: '+242', label: 'Congo (Brazzaville)', flag: 'CG' },
  { code: '+243', label: 'DR Congo', flag: 'CD' },
  { code: '+245', label: 'Guinea-Bissau', flag: 'GW' },
  { code: '+248', label: 'Seychelles', flag: 'SC' },
  { code: '+249', label: 'Sudan', flag: 'SD' },
  { code: '+251', label: 'Ethiopia', flag: 'ET' },
  { code: '+252', label: 'Somalia', flag: 'SO' },
  { code: '+258', label: 'Mozambique', flag: 'MZ' },
  { code: '+269', label: 'Comoros', flag: 'KM' },
  { code: '+212', label: 'Morocco', flag: 'MA' },
  { code: '+216', label: 'Tunisia', flag: 'TN' },
  { code: '+218', label: 'Libya', flag: 'LY' },
  { code: '+20', label: 'Egypt', flag: 'EG' },
  { code: '+91', label: 'India', flag: 'IN' },
  { code: '+92', label: 'Pakistan', flag: 'PK' },
  { code: '+93', label: 'Afghanistan', flag: 'AF' },
  { code: '+94', label: 'Sri Lanka', flag: 'LK' },
  { code: '+95', label: 'Myanmar', flag: 'MM' },
  { code: '+98', label: 'Iran', flag: 'IR' },
  { code: '+880', label: 'Bangladesh', flag: 'BD' },
  { code: '+850', label: 'North Korea', flag: 'KP' },
  { code: '+852', label: 'Hong Kong', flag: 'HK' },
  { code: '+853', label: 'Macau', flag: 'MO' },
  { code: '+855', label: 'Cambodia', flag: 'KH' },
  { code: '+856', label: 'Laos', flag: 'LA' },
  { code: '+86', label: 'China', flag: 'CN' },
  { code: '+886', label: 'Taiwan', flag: 'TW' },
  { code: '+90', label: 'Turkey', flag: 'TR' },
  { code: '+62', label: 'Indonesia', flag: 'ID' },
  { code: '+63', label: 'Philippines', flag: 'PH' },
  { code: '+65', label: 'Singapore', flag: 'SG' },
  { code: '+66', label: 'Thailand', flag: 'TH' },
  { code: '+81', label: 'Japan', flag: 'JP' },
  { code: '+82', label: 'South Korea', flag: 'KR' },
  { code: '+84', label: 'Vietnam', flag: 'VN' },
  { code: '+7', label: 'Russia/Kazakhstan', flag: 'RU' },
  { code: '+49', label: 'Germany', flag: 'DE' },
  { code: '+33', label: 'France', flag: 'FR' },
  { code: '+39', label: 'Italy', flag: 'IT' },
  { code: '+34', label: 'Spain', flag: 'ES' },
  { code: '+31', label: 'Netherlands', flag: 'NL' },
  { code: '+32', label: 'Belgium', flag: 'BE' },
  { code: '+41', label: 'Switzerland', flag: 'CH' },
  { code: '+43', label: 'Austria', flag: 'AT' },
  { code: '+45', label: 'Denmark', flag: 'DK' },
  { code: '+46', label: 'Sweden', flag: 'SE' },
  { code: '+47', label: 'Norway', flag: 'NO' },
  { code: '+48', label: 'Poland', flag: 'PL' },
  { code: '+351', label: 'Portugal', flag: 'PT' },
  { code: '+352', label: 'Luxembourg', flag: 'LU' },
  { code: '+353', label: 'Ireland', flag: 'IE' },
  { code: '+354', label: 'Iceland', flag: 'IS' },
  { code: '+358', label: 'Finland', flag: 'FI' },
  { code: '+359', label: 'Bulgaria', flag: 'BG' },
  { code: '+370', label: 'Lithuania', flag: 'LT' },
  { code: '+371', label: 'Latvia', flag: 'LV' },
  { code: '+372', label: 'Estonia', flag: 'EE' },
  { code: '+374', label: 'Armenia', flag: 'AM' },
  { code: '+375', label: 'Belarus', flag: 'BY' },
  { code: '+376', label: 'Andorra', flag: 'AD' },
  { code: '+377', label: 'Monaco', flag: 'MC' },
  { code: '+378', label: 'San Marino', flag: 'SM' },
  { code: '+380', label: 'Ukraine', flag: 'UA' },
  { code: '+381', label: 'Serbia', flag: 'RS' },
  { code: '+385', label: 'Croatia', flag: 'HR' },
  { code: '+386', label: 'Slovenia', flag: 'SI' },
  { code: '+387', label: 'Bosnia & Herzegovina', flag: 'BA' },
  { code: '+389', label: 'North Macedonia', flag: 'MK' },
  { code: '+30', label: 'Greece', flag: 'GR' },
  { code: '+36', label: 'Hungary', flag: 'HU' },
  { code: '+40', label: 'Romania', flag: 'RO' },
  { code: '+420', label: 'Czech Republic', flag: 'CZ' },
  { code: '+421', label: 'Slovakia', flag: 'SK' },
  { code: '+61', label: 'Australia', flag: 'AU' },
  { code: '+64', label: 'New Zealand', flag: 'NZ' },
  { code: '+675', label: 'Papua New Guinea', flag: 'PG' },
  { code: '+676', label: 'Tonga', flag: 'TO' },
  { code: '+677', label: 'Solomon Islands', flag: 'SB' },
  { code: '+678', label: 'Vanuatu', flag: 'VU' },
  { code: '+679', label: 'Fiji', flag: 'FJ' },
  { code: '+680', label: 'Palau', flag: 'PW' },
  { code: '+682', label: 'Cook Islands', flag: 'CK' },
  { code: '+685', label: 'Samoa', flag: 'WS' },
  { code: '+686', label: 'Kiribati', flag: 'KI' },
  { code: '+687', label: 'New Caledonia', flag: 'NC' },
  { code: '+688', label: 'Tuvalu', flag: 'TV' },
  { code: '+689', label: 'French Polynesia', flag: 'PF' },
  { code: '+691', label: 'Micronesia', flag: 'FM' },
  { code: '+692', label: 'Marshall Islands', flag: 'MH' },
  { code: '+840', label: 'Tanzania (alt)', flag: 'TZ' },
  { code: '+960', label: 'Maldives', flag: 'MV' },
  { code: '+961', label: 'Lebanon', flag: 'LB' },
  { code: '+962', label: 'Jordan', flag: 'JO' },
  { code: '+963', label: 'Syria', flag: 'SY' },
  { code: '+964', label: 'Iraq', flag: 'IQ' },
  { code: '+965', label: 'Kuwait', flag: 'KW' },
  { code: '+966', label: 'Saudi Arabia', flag: 'SA' },
  { code: '+967', label: 'Yemen', flag: 'YE' },
  { code: '+968', label: 'Oman', flag: 'OM' },
  { code: '+971', label: 'UAE', flag: 'AE' },
  { code: '+972', label: 'Israel', flag: 'IL' },
  { code: '+973', label: 'Bahrain', flag: 'BH' },
  { code: '+974', label: 'Qatar', flag: 'QA' },
  { code: '+975', label: 'Bhutan', flag: 'BT' },
  { code: '+976', label: 'Mongolia', flag: 'MN' },
  { code: '+977', label: 'Nepal', flag: 'NP' },
  { code: '+994', label: 'Azerbaijan', flag: 'AZ' },
  { code: '+995', label: 'Georgia', flag: 'GE' },
  { code: '+996', label: 'Kyrgyzstan', flag: 'KG' },
  { code: '+998', label: 'Uzbekistan', flag: 'UZ' },
  { code: '+1', label: 'Jamaica', flag: 'JM' },
  { code: '+1', label: 'Trinidad & Tobago', flag: 'TT' },
  { code: '+1', label: 'Bahamas', flag: 'BS' },
  { code: '+1', label: 'Barbados', flag: 'BB' },
  { code: '+52', label: 'Mexico', flag: 'MX' },
  { code: '+53', label: 'Cuba', flag: 'CU' },
  { code: '+54', label: 'Argentina', flag: 'AR' },
  { code: '+55', label: 'Brazil', flag: 'BR' },
  { code: '+56', label: 'Chile', flag: 'CL' },
  { code: '+57', label: 'Colombia', flag: 'CO' },
  { code: '+58', label: 'Venezuela', flag: 'VE' },
  { code: '+501', label: 'Belize', flag: 'BZ' },
  { code: '+502', label: 'Guatemala', flag: 'GT' },
  { code: '+503', label: 'El Salvador', flag: 'SV' },
  { code: '+504', label: 'Honduras', flag: 'HN' },
  { code: '+505', label: 'Nicaragua', flag: 'NI' },
  { code: '+506', label: 'Costa Rica', flag: 'CR' },
  { code: '+507', label: 'Panama', flag: 'PA' },
  { code: '+51', label: 'Peru', flag: 'PE' },
  { code: '+591', label: 'Bolivia', flag: 'BO' },
  { code: '+592', label: 'Guyana', flag: 'GY' },
  { code: '+593', label: 'Ecuador', flag: 'EC' },
  { code: '+594', label: 'French Guiana', flag: 'GF' },
  { code: '+595', label: 'Paraguay', flag: 'PY' },
  { code: '+596', label: 'Martinique', flag: 'MQ' },
  { code: '+597', label: 'Suriname', flag: 'SR' },
  { code: '+598', label: 'Uruguay', flag: 'UY' },
  { code: '+599', label: 'Curaçao', flag: 'CW' },
];

const MODE_COPY: Record<Mode, { title: string; subtitle: string; cta: string; alt: string; altLink: string }> = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to your account to continue',
    cta: 'Sign in',
    alt: "Don't have an account?",
    altLink: 'Create one',
  },
  register: {
    title: 'Create account',
    subtitle: 'Start your journey with us today',
    cta: 'Create account',
    alt: 'Already have an account?',
    altLink: 'Sign in',
  },
};

interface LoginPageProps {
  initialRef?: string;
  onAuth: (phone: string, balance: number, referralCode: string) => void;
}

export default function LoginPage({ initialRef = '', onAuth }: LoginPageProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+256');
  const [countryOpen, setCountryOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', password: '', referral: initialRef });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const copy = MODE_COPY[mode];
  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0];

  const validate = () => {
    const next: Record<string, string> = {};
    if (mode === 'register' && !form.name.trim()) next.name = 'Name is required';
    if (!form.phone.trim()) next.phone = 'Phone number is required';
    else if (!/^\d{6,15}$/.test(form.phone.replace(/\s/g, ''))) next.phone = 'Enter a valid phone number';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'At least 6 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    const fullPhone = `${countryCode} ${form.phone}`;
    const result =
      mode === 'register'
        ? await registerUser(fullPhone, form.password, form.referral.trim() || undefined)
        : await loginUser(fullPhone, form.password);
    setLoading(false);
    if (result.error) { setServerError(result.error); return; }
    onAuth(fullPhone, result.balance, result.referralCode);
  };

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-semibold tracking-tight">ASUS</span>
          </div>

          <div className="max-w-md">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
              Secure access to your digital workspace
            </h2>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              Manage your projects, collaborate with your team, and keep your data protected — all in one place.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              {['256-bit encryption', 'SOC 2 compliant', '99.9% uptime'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-500">© 2026 ASUS. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight">ASUS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
            <p className="mt-2 text-slate-400">{copy.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {mode === 'register' && (
              <Field
                id="name"
                label="Full name"
                icon={<User className="w-5 h-5" />}
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Jane Doe"
                error={errors.name}
                type="text"
              />
            )}

            {mode === 'register' && (
              <Field
                id="referral"
                label="Invitation Code (optional)"
                icon={<Gift className="w-5 h-5" />}
                value={form.referral}
                onChange={(v) => setForm({ ...form, referral: v.toUpperCase() })}
                placeholder="e.g. X7K2QM9P"
                type="text"
              />
            )}

            {/* Phone number with country code */}
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-slate-300">
                Phone number
              </label>
              <div
                className={`relative flex items-stretch rounded-xl border bg-slate-900/60 transition-all focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/20 ${
                  errors.phone ? 'border-red-500/60' : 'border-slate-700'
                }`}
              >
                {/* Country code selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCountryOpen((o) => !o)}
                    className="flex items-center gap-1.5 h-full px-3.5 text-sm font-medium text-slate-200 border-r border-slate-700 hover:bg-slate-800/60 transition-colors rounded-l-xl"
                  >
                    <span className="text-base leading-none">{countryFlag(selectedCountry.flag)}</span>
                    <span>{selectedCountry.code}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${countryOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {countryOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setCountryOpen(false)}
                      />
                      <ul className="absolute z-20 mt-2 max-h-64 w-56 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 py-1.5 shadow-2xl shadow-black/50 scroll-smooth">
                        {COUNTRY_CODES.map((c) => (
                          <li key={c.code}>
                            <button
                              type="button"
                              onClick={() => {
                                setCountryCode(c.code);
                                setCountryOpen(false);
                              }}
                              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-slate-800 ${
                                c.code === countryCode ? 'text-emerald-400' : 'text-slate-300'
                              }`}
                            >
                              <span className="text-base leading-none">{countryFlag(c.flag)}</span>
                              <span className="flex-1 text-left">{c.label}</span>
                              <span className="text-slate-500">{c.code}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                {/* Phone input */}
                <div className="flex items-center flex-1">
                  <span className="pl-3 text-slate-500">
                    <Phone className="w-5 h-5" />
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="801 234 5678"
                    className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none"
                  />
                </div>
              </div>
              {errors.phone && <p className="mt-1.5 text-sm text-red-400">{errors.phone}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div
                className={`relative flex items-center rounded-xl border bg-slate-900/60 transition-all focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/20 ${
                  errors.password ? 'border-red-500/60' : 'border-slate-700'
                }`}
              >
                <span className="pl-4 text-slate-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="px-4 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-400">{errors.password}</p>}
            </div>

            {mode === 'login' && (
              <label className="flex items-center gap-2.5 text-sm text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-400/40 focus:ring-offset-0"
                />
                Keep me signed in
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-3.5 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:brightness-110 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {copy.cta}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {serverError && (
              <p className="text-sm text-red-400 text-center">{serverError}</p>
            )}
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-xs text-slate-500 bg-slate-950">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Google', icon: 'G' },
              { label: 'GitHub', icon: 'GH' },
              { label: 'SSO', icon: 'S' },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800/60 active:scale-[0.98]"
              >
                <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-400">
                  {p.icon}
                </span>
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            {copy.alt}{' '}
            <button
              onClick={switchMode}
              className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {copy.altLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function countryFlag(code: string): string {
  const offset = 0x1f1e6 - 65;
  return String.fromCodePoint(...[...code].map((c) => c.charCodeAt(0) + offset));
}

function Field({
  id,
  label,
  icon,
  value,
  onChange,
  placeholder,
  error,
  type,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  type: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-300">
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-xl border bg-slate-900/60 transition-all focus-within:border-emerald-400/60 focus-within:ring-2 focus-within:ring-emerald-400/20 ${
          error ? 'border-red-500/60' : 'border-slate-700'
        }`}
      >
        <span className="pl-4 text-slate-500">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none"
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
}
