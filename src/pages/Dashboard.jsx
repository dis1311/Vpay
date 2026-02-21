import React, { useState, useEffect, } from 'react';
import { Mic, Zap, Smartphone, Droplets, CreditCard, History, LogOut, QrCode, TrendingUp, ShieldCheck, Loader2, AlertCircle, ArrowUpRight, Wallet, User as UserIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import VoiceAssistant from '../components/VoiceAssistant';
import { Link} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';   
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
   
const Dashboard = () => {
  const { user, token, logout, updateBalance } = useAuth();
  const [lastCommand, setLastCommand] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (showHistory) {
      fetchTransactions();
    }
  }, [showHistory]);

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const response = await fetch('/api/auth/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const qrValue = lastCommand && lastCommand.intent ? 
    `vpay://pay?amount=${lastCommand.intent.amount}&biller=${encodeURIComponent(lastCommand.intent.biller || 'Merchant')}` 
    : `vpay://user/${user?.id}`;

  const handleIntentDetected = async (data) => {
    setLastCommand(data);
    
    if (data.intent && data.intent.type === 'bill_payment' && data.intent.amount > 0) {
      await initiatePayment(data.intent.amount, data.intent.biller, data.intent.category);
    }
  };

  const initiatePayment = async (amount, biller = 'Merchant', category = 'General') => {
    if (user.balance < amount) {
      toast.error("Insufficient balance");
      setPaymentStatus('failed');
      return;
    }

    setPaymentStatus('processing');
    try {
      // 1. Create order
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, biller, category })
      });

      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.detail || 'Payment failed');

      // 2. Verify payment (Mocking the verification step for now)
      const verifyRes = await fetch('http://localhost:8000/api/payment/verify-payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          transaction_id: orderData.transaction_id,
          amount: amount
        })
      });

      if (verifyRes.ok) {
        setTimeout(() => {
          setPaymentStatus('success');
          updateBalance(user.balance - amount);
          toast.success(`Payment of ₹${amount} to ${biller} successful!`);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#818cf8', '#c7d2fe']
          });
          if (showHistory) fetchTransactions();
        }, 1500);
      } else {
        throw new Error('Verification failed');
      }

    } catch (error) {
      toast.error(error.message);
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Premium Header */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="bg-indigo-600 p-2.5 rounded-2xl shadow-indigo-200 shadow-lg group-hover:shadow-indigo-300 transition-all">
              <Mic className="text-white w-6 h-6" />
            </motion.div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">Vpay<span className="text-indigo-600">.</span></span>
          </Link>
          <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Dashboard
</motion.div>         
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Status</span>
              <div className="flex items-center gap-1.5 text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Protected</span>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{user?.email}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Left Column: AI & Interaction (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Wallet Overview Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full -ml-10 -mb-10 blur-2xl" />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                  <p className="text-indigo-100 text-sm font-medium mb-1 opacity-80">Total Balance</p>
                  <h1 className="text-5xl font-bold tracking-tight">₹{user?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h1>
                  <div className="mt-4 flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-indigo-50">Savings up 12% this month</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg">
                    Add Money
                  </button>
                  <button className="bg-indigo-500/30 border border-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-500/50 transition-all">
                    Withdraw
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Voice Assistant Section */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <VoiceAssistant onIntentDetected={handleIntentDetected} />
              
              <AnimatePresence mode="wait">
                {lastCommand ? (
                  <motion.div 
                    key="command"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 flex flex-col justify-between h-full min-h-[280px]"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Intent Detected</span>
                      </div>
                      <p className="text-xl font-medium text-slate-800 leading-relaxed italic">
                        "{lastCommand.text}"
                      </p>
                    </div>
                    
                    {lastCommand.intent?.type === 'bill_payment' && (
                      <div className="mt-8 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-3 rounded-xl shadow-sm text-indigo-600">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Payable Amount</p>
                            <p className="text-lg font-bold text-indigo-900">₹{lastCommand.intent.amount}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-indigo-300" />
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-4 min-h-[280px]"
                  >
                    <div className="bg-white p-4 rounded-2xl shadow-sm">
                      <Wallet className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-400">Waiting for Voice</h4>
                      <p className="text-sm text-slate-400 mt-1 max-w-[160px]">Try saying "Pay my electricity bill 500"</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Payment Status Notification */}
            <AnimatePresence>
              {paymentStatus && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-6 rounded-3xl shadow-xl border-2 flex items-center gap-6 ${
                    paymentStatus === 'success' ? 'bg-emerald-50 border-emerald-100' : 
                    paymentStatus === 'failed' ? 'bg-rose-50 border-rose-100' : 
                    'bg-white border-indigo-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    paymentStatus === 'success' ? 'bg-emerald-500 text-white' : 
                    paymentStatus === 'failed' ? 'bg-rose-500 text-white' : 
                    'bg-indigo-600 text-white'
                  }`}>
                    {paymentStatus === 'processing' && <Loader2 className="w-7 h-7 animate-spin" />}
                    {paymentStatus === 'success' && <ShieldCheck className="w-7 h-7" />}
                    {paymentStatus === 'failed' && <AlertCircle className="w-7 h-7" />}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${
                      paymentStatus === 'success' ? 'text-emerald-900' : 
                      paymentStatus === 'failed' ? 'text-rose-900' : 
                      'text-indigo-900'
                    }`}>
                      {paymentStatus === 'success' ? 'Transaction Securely Completed' : 
                       paymentStatus === 'failed' ? 'Transaction Interrupted' : 
                       'Verifying with Bank...'}
                    </h3>
                    <p className={`text-sm mt-0.5 font-medium ${
                      paymentStatus === 'success' ? 'text-emerald-600/80' : 
                      paymentStatus === 'failed' ? 'text-rose-600/80' : 
                      'text-indigo-600/80'
                    }`}>
                      {paymentStatus === 'success' ? 'Your payment has been successfully processed.' : 
                       paymentStatus === 'failed' ? 'An error occurred. Please try again later.' : 
                       'This usually takes a few seconds. Do not refresh.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: QR & Insights (5 cols) */}
          <div className="lg:col-span-5 space-y-10">
            
            {/* Smart QR Card */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 text-center space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-indigo-600" />
                  Dynamic QR
                </h2>
                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Real-time</span>
              </div>
              
              <div className="bg-slate-50 p-6 rounded-[2rem] inline-block border border-slate-100 relative group">
                <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity rounded-[2rem]" />
                <QRCodeCanvas 
                  id="payment-qr" 
                  value={qrValue} 
                  size={200} 
                  includeMargin={false}
                  className="rounded-xl"
                  fgColor="#1e293b"
                />
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
                  {lastCommand?.intent ? (
                    <>Sending <span className="text-slate-900 font-bold">₹{lastCommand.intent.amount}</span> to <span className="text-indigo-600 font-bold">{lastCommand.intent.biller || 'Merchant'}</span></>
                  ) : 'Scan this code to receive payments instantly from any UPI app'}
                </p>
                <button
                  onClick={() => {
                    const canvas = document.getElementById('payment-qr');
                    const url = canvas?.toDataURL('image/png');
                    if (url) {
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'vpay-secure-qr.png';
                      link.click();
                    }
                  }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
                >
                  Download Secure QR
                </button>
              </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800 px-2">One-Tap Payments</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Zap, label: 'Electricity', color: 'bg-amber-100 text-amber-600' },
                  { icon: Droplets, label: 'Water', color: 'bg-blue-100 text-blue-600' },
                  { icon: Smartphone, label: 'Recharge', color: 'bg-indigo-100 text-indigo-600' },
                  { icon: History, label: 'Logs', color: 'bg-slate-100 text-slate-600', action: () => setShowHistory(true) }
                ].map((item, idx) => (
                  <motion.button 
                    key={idx}
                    whileHover={{ y: -5, scale: 1.02 }}
                    onClick={item.action}
                    className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all flex flex-col items-center gap-4 group"
                  >
                    <div className={`${item.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm tracking-tight">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </section>

            {/* Recent Activity Card */}
            <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
                <button 
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  {showHistory ? 'Close History' : 'View All'}
                </button>
              </div>
              <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                {loadingTransactions ? (
                  <div className="p-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
                  </div>
                ) : transactions.length > 0 ? (
                  transactions.slice(0, showHistory ? undefined : 5).map((tx, i) => (
                    <div key={tx.id || i} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${
                          tx.category === 'Electricity' ? 'bg-amber-50 text-amber-500' :
                          tx.category === 'Water' ? 'bg-blue-50 text-blue-500' :
                          tx.category === 'Recharge' ? 'bg-indigo-50 text-indigo-500' :
                          'bg-slate-50 text-slate-500'
                        }`}>
                          {tx.category === 'Electricity' ? <Zap className="w-5 h-5" /> :
                           tx.category === 'Water' ? <Droplets className="w-5 h-5" /> :
                           tx.category === 'Recharge' ? <Smartphone className="w-5 h-5" /> :
                           <Wallet className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm">{tx.biller}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {new Date(tx.timestamp * 1000).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold text-sm ${tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-slate-400 text-sm font-medium">
                    No transactions yet
                  </div>
                )}
              </div>
              
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
