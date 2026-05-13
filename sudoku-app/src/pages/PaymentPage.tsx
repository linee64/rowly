import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  Smartphone, 
  Globe,
  Lock,
  ShieldCheck,
  Coins
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStatsStore } from '../store/statsStore';

export const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addCoins } = useStatsStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'google' | null>(null);

  const pack = location.state?.pack || { amount: 500, price: 500, label: 'Starter Pack' };

  const handlePayment = () => {
    if (!selectedMethod) return;
    
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      addCoins(pack.amount);
      
      // Auto redirect after success
      setTimeout(() => {
        navigate('/dashboard/shop');
      }, 3000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black mb-2">Payment Successful!</h2>
          <p className="text-tx-secondary mb-8">
            You've successfully purchased {pack.amount} coins. They have been added to your balance.
          </p>
          <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 w-full flex items-center justify-between mb-8">
            <div className="flex items-center text-gold">
              <Coins className="w-5 h-5 mr-2 fill-current" />
              <span className="font-bold">+{pack.amount} Coins</span>
            </div>
            <span className="text-tx-muted text-xs uppercase font-bold tracking-widest">Added</span>
          </div>
          <p className="text-xs text-tx-muted animate-pulse">Redirecting to shop...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/dashboard/shop')} 
        className="mb-8 -ml-2 text-tx-secondary hover:text-tx-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-black mb-6">Checkout</h1>
          
          <div className="space-y-4">
            <button 
              onClick={() => setSelectedMethod('card')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                selectedMethod === 'card' ? 'border-gold bg-gold/5 shadow-lg shadow-gold/5' : 'border-border hover:bg-elevated'
              }`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-tx-secondary" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Credit or Debit Card</p>
                  <p className="text-xs text-tx-muted">Visa, Mastercard, Amex</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-gold bg-gold' : 'border-border'}`}>
                {selectedMethod === 'card' && <div className="w-2 h-2 bg-primary rounded-full" />}
              </div>
            </button>

            <button 
              onClick={() => setSelectedMethod('paypal')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                selectedMethod === 'paypal' ? 'border-gold bg-gold/5 shadow-lg shadow-gold/5' : 'border-border hover:bg-elevated'
              }`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-tx-secondary" />
                </div>
                <div className="text-left">
                  <p className="font-bold">PayPal</p>
                  <p className="text-xs text-tx-muted">Fast and secure payment</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'paypal' ? 'border-gold bg-gold' : 'border-border'}`}>
                {selectedMethod === 'paypal' && <div className="w-2 h-2 bg-primary rounded-full" />}
              </div>
            </button>

            <button 
              onClick={() => setSelectedMethod('google')}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                selectedMethod === 'google' ? 'border-gold bg-gold/5 shadow-lg shadow-gold/5' : 'border-border hover:bg-elevated'
              }`}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mr-4">
                  <Smartphone className="w-6 h-6 text-tx-secondary" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Google Pay</p>
                  <p className="text-xs text-tx-muted">Quick mobile payment</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'google' ? 'border-gold bg-gold' : 'border-border'}`}>
                {selectedMethod === 'google' && <div className="w-2 h-2 bg-primary rounded-full" />}
              </div>
            </button>
          </div>

          <div className="p-6 bg-surface border border-border rounded-2xl">
            <div className="flex items-center text-tx-muted text-xs mb-4">
              <ShieldCheck className="w-4 h-4 mr-2 text-success" />
              Your payment information is encrypted and secure.
            </div>
            <Button 
              variant="gold" 
              className="w-full py-6 text-lg font-black shadow-xl shadow-gold/20 disabled:opacity-50"
              disabled={!selectedMethod || isProcessing}
              onClick={handlePayment}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay {pack.price} ₸
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-bold mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Coins className="w-4 h-4 text-gold mr-2 fill-current" />
                  <span className="text-sm text-tx-secondary">{pack.label} ({pack.amount} Coins)</span>
                </div>
                <span className="font-bold">{pack.price} ₸</span>
              </div>
              <div className="flex justify-between items-center text-xs text-tx-muted">
                <span>Tax (0%)</span>
                <span>0 ₸</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex justify-between items-center mb-8">
              <span className="font-bold">Total</span>
              <span className="text-2xl font-black text-gold">{pack.price} ₸</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-[10px] text-tx-muted font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 mr-2 text-success" />
                Instant Delivery
              </div>
              <div className="flex items-center text-[10px] text-tx-muted font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3 mr-2 text-success" />
                Secure Checkout
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
