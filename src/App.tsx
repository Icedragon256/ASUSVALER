import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import RechargePage from './components/RechargePage';
import WithdrawPage from './components/WithdrawPage';
import PaymentsAdmin from './components/PaymentsAdmin';
import ProfilePage from './components/ProfilePage';
import AboutPage from './components/AboutPage';
import ChangePasswordPage from './components/ChangePasswordPage';
import ProductPage from './components/ProductPage';
import MyProductsPage from './components/MyProductsPage';
import PurchaseConfirmPage from './components/PurchaseConfirmPage';
import PurchasesAdminPage from './components/PurchasesAdminPage';
import RegulationPage from './components/RegulationPage';
import BindBankCardPage from './components/BindBankCardPage';
import RewardsPage from './components/RewardsPage';
import { supabase, updateBalance } from './lib/supabase';

type View =
  | 'login' | 'dashboard' | 'recharge' | 'withdraw' | 'payments'
  | 'profile' | 'about' | 'changepwd' | 'product' | 'myproducts'
  | 'purchase' | 'purchasesAdmin' | 'regulation' | 'bindbank' | 'rewards';

export interface Product {
  vip: string;
  name: string;
  price: string;
  priceNum: number;
  term: string;
  daily: string;
  total: string;
  img: string;
  soldOut?: boolean;
}

export interface Purchase {
  id: string;
  phone: string;
  vip: string;
  name: string;
  price_num: number;
  price: string;
  daily: string;
  total: string;
  img: string;
  purchased_at: string;
}

// Read ?ref=CODE from the URL at startup (before login)
const urlRef = new URLSearchParams(window.location.search).get('ref') ?? '';

function App() {
  const [view, setView] = useState<View>('login');
  const [phone, setPhone] = useState('');
  const [balance, setBalance] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    if (!phone) return;
    supabase
      .from('purchases')
      .select('*')
      .eq('phone', phone)
      .order('purchased_at', { ascending: false })
      .then(({ data }) => { if (data) setPurchases(data); });
  }, [phone]);

  const handleAuth = (p: string, bal: number, code: string) => {
    setPhone(p);
    setBalance(bal);
    setReferralCode(code);
    setView('dashboard');
  };

  const handleBuy = (product: Product) => {
    setSelectedProduct(product);
    setView('purchase');
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;
    const { data } = await supabase
      .from('purchases')
      .insert({
        phone,
        vip: selectedProduct.vip,
        name: selectedProduct.name,
        price_num: selectedProduct.priceNum,
        price: selectedProduct.price,
        daily: selectedProduct.daily,
        total: selectedProduct.total,
        img: selectedProduct.img,
      })
      .select()
      .single();
    if (data) setPurchases(prev => [data, ...prev]);
    const newBalance = balance - selectedProduct.priceNum;
    setBalance(newBalance);
    await updateBalance(phone, newBalance);
    setView('product');
    setSelectedProduct(null);
  };

  if (view === 'login') return <LoginPage initialRef={urlRef} onAuth={handleAuth} />;
  if (view === 'recharge') return <RechargePage onBack={() => setView('dashboard')} />;
  if (view === 'withdraw') return <WithdrawPage phone={phone} balance={balance} onBack={() => setView('dashboard')} />;
  if (view === 'payments') return <PaymentsAdmin onBack={() => setView('dashboard')} onApprove={(amount) => { const nb = balance + amount; setBalance(nb); updateBalance(phone, nb); }} />;
  if (view === 'about') return <AboutPage onBack={() => setView('profile')} />;
  if (view === 'regulation') return <RegulationPage onBack={() => setView('profile')} />;
  if (view === 'bindbank') return <BindBankCardPage phone={phone} onBack={() => setView('profile')} />;
  if (view === 'changepwd') return <ChangePasswordPage phone={phone} onBack={() => setView('profile')} />;
  if (view === 'myproducts') return <MyProductsPage purchases={purchases} onBack={() => setView('product')} />;
  if (view === 'purchasesAdmin') return <PurchasesAdminPage onBack={() => setView('dashboard')} />;
  if (view === 'rewards') return <RewardsPage phone={phone} referralCode={referralCode} onBack={() => setView('dashboard')} />;
  if (view === 'purchase') return (
    <PurchaseConfirmPage
      product={selectedProduct!}
      balance={balance}
      onConfirm={handleConfirmPurchase}
      onCancel={() => setView('product')}
    />
  );
  if (view === 'product') return (
    <ProductPage
      balance={balance}
      purchaseCount={purchases.length}
      onHome={() => setView('dashboard')}
      onProfile={() => setView('profile')}
      onMyProducts={() => setView('myproducts')}
      onRewards={() => setView('rewards')}
      onBuy={handleBuy}
    />
  );
  if (view === 'profile') return (
    <ProfilePage
      phone={phone}
      balance={balance}
      onRecharge={() => setView('recharge')}
      onWithdraw={() => setView('withdraw')}
      onLogout={() => setView('login')}
      onAbout={() => setView('about')}
      onChangePassword={() => setView('changepwd')}
      onRegulation={() => setView('regulation')}
      onBindBankCard={() => setView('bindbank')}
      onRewards={() => setView('rewards')}
      onHome={() => setView('dashboard')}
      onProduct={() => setView('product')}
    />
  );
  return (
    <Dashboard
      onLogout={() => setView('login')}
      onRecharge={() => setView('recharge')}
      onWithdraw={() => setView('withdraw')}
      onPayments={() => setView('payments')}
      onProfile={() => setView('profile')}
      onProduct={() => setView('product')}
      onPurchasesAdmin={() => setView('purchasesAdmin')}
      onRewards={() => setView('rewards')}
    />
  );
}

export default App;
