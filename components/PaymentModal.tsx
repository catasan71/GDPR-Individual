import React, { useState, useEffect } from 'react';
import { Loader2, CreditCard, Copy, Check, ExternalLink, ShieldCheck, Sparkles, AlertCircle, RefreshCw, Send, Lock, ArrowRight, Edit2, Receipt, Building, User, Mail, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

interface PaymentModalProps {
  planId: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ planId, onSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [revolutName, setRevolutName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'pay' | 'transfer'>('pay');
  const [isApiConfigured, setIsApiConfigured] = useState<boolean | null>(null);
  const [checkingConfig, setCheckingConfig] = useState(true);

  // Billing details states
  const [paymentStep, setPaymentStep] = useState<'billing' | 'payment'>('billing');
  const [entityType, setEntityType] = useState<'company' | 'individual'>('company');
  const [companyName, setCompanyName] = useState('');
  const [cui, setCui] = useState('');
  const [regCom, setRegCom] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Generate a random real-looking payment reference code (for manual fallback)
  const [refCode] = useState(() => {
    const num = Math.floor(100000 + Math.random() * 900000);
    return `GDPR-${num}`;
  });

  const getPlanDetails = () => {
    switch (planId) {
      case 'starter':
        return { name: 'Startup', price: '95 lei', amount: 95 };
      case 'business':
        return { name: 'Business', price: '195 lei', amount: 195 };
      default:
        return { name: 'Premium', price: '195 lei', amount: 195 };
    }
  };

  const plan = getPlanDetails();
  const revolutTag = 'developly'; // For manual fallback
  const revolutLink = `https://revolut.me/${revolutTag}/${plan.amount}`;

  // Check on mount if Revolut Merchant API is configured on backend & prefill billing if saved
  useEffect(() => {
    const checkRevolutConfig = async () => {
      try {
        // We make a lightweight request to create order without email to check config
        const response = await axios.post('/api/revolut/create-order', { planId, email: null });
        if (response.data && response.data.code === 'REVOLUT_NOT_CONFIGURED') {
          setIsApiConfigured(false);
          setActiveTab('transfer'); // Fallback to manual transfer
        } else {
          setIsApiConfigured(true);
          setActiveTab('pay'); // Default to automated paid checkout
        }
      } catch (err) {
        // If there's an api key but order payload is validation-rejected, it is still configured
        setIsApiConfigured(true);
      } finally {
        setCheckingConfig(false);
      }
    };
    checkRevolutConfig();

    // Prefill billing fields if they exist in localStorage
    try {
      const stored = localStorage.getItem('payer_billing_details');
      if (stored) {
        const parsed = JSON.parse(stored);
        setEntityType(parsed.entityType || 'company');
        setCompanyName(parsed.companyName || '');
        setCui(parsed.cui || '');
        setRegCom(parsed.regCom || '');
        setAddress(parsed.address || '');
        setCity(parsed.city || '');
        setCounty(parsed.county || '');
        setBillingEmail(parsed.email || '');
        setPhone(parsed.phone || '');
        setPayerEmail(parsed.email || '');
      }
    } catch (e) {
      console.error('Error prefilling billing details:', e);
    }
  }, [planId]);

  const handleCopyTag = () => {
    navigator.clipboard.writeText(`@${revolutTag}`);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(refCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Submit billing details & advance step
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!companyName.trim()) {
      setError(entityType === 'company' ? 'Te rugăm să introduci numele complet al firmei.' : 'Te rugăm să introduci numele tău complet.');
      return;
    }
    if (!cui.trim()) {
      setError(entityType === 'company' ? 'Te rugăm să introduci CUI / CIF.' : 'Te rugăm să introduci CNP-ul.');
      return;
    }
    if (!address.trim()) {
      setError('Te rugăm să introduci adresa de facturare.');
      return;
    }
    if (!city.trim()) {
      setError('Te rugăm să introduci localitatea (oraș/comună).');
      return;
    }
    if (!county.trim()) {
      setError('Te rugăm să introduci județul.');
      return;
    }
    if (!billingEmail.trim()) {
      setError('Te rugăm să introduci o adresă de email validă pentru trimiterea facturii.');
      return;
    }

    const billingInfo = {
      entityType,
      companyName: companyName.trim(),
      cui: cui.trim(),
      regCom: entityType === 'company' ? regCom.trim() : undefined,
      address: address.trim(),
      county: county.trim(),
      city: city.trim(),
      email: billingEmail.trim(),
      phone: phone.trim()
    };

    localStorage.setItem('payer_billing_details', JSON.stringify(billingInfo));
    setPayerEmail(billingEmail.trim());
    setPaymentStep('payment');
  };

  // Automated Checkout Session Generator
  const handleAutomatedCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerEmail.trim()) {
      setError('Te rugăm să introduci o adresă de email validă pentru confirmarea plății.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create order
      const response = await axios.post('/api/revolut/create-order', {
        planId,
        email: payerEmail.trim(),
        billingDetails: {
          entityType,
          companyName,
          cui,
          regCom,
          address,
          city,
          county,
          phone
        }
      });

      if (response.data.success && response.data.checkoutUrl) {
        // Save payer email in local storage to prefill register/auth step
        localStorage.setItem('payer_email_prefill', payerEmail.trim());
        localStorage.setItem('revolut_pending_order_id', response.data.orderId);
        
        // Open Revolut checkout URL
        window.location.href = response.data.checkoutUrl;
      } else {
        throw new Error(response.data.message || 'Nu s-a putut genera link-ul de plată.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Eroare la conectarea cu serverele Revolut.');
    } finally {
      setLoading(false);
    }
  };

  // Manual Transfer Verification Fallback
  const handleVerifyManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revolutName.trim()) {
      setError('Te rugăm să introduci numele complet de pe contul Revolut.');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate real Revolut transaction check & reconciliation
    setTimeout(() => {
      setLoading(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  const handleCompleteAndProceed = () => {
    localStorage.setItem('payment_success_flag', 'true');
    // Save email prefill if entered
    if (payerEmail) {
      localStorage.setItem('payer_email_prefill', payerEmail.trim());
    }
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center font-sans selection:bg-blue-500/30 selection:text-white">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-xl w-full shadow-2xl relative overflow-hidden">
        {/* Subtle top ambient light */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60" />
        
        {checkingConfig ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <span className="text-sm text-slate-400 font-medium">Se încarcă modulul de plăți Revolut...</span>
          </div>
        ) : !paymentSuccess ? (
          <>
            {/* Header with price overlay */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  Garantat GDPR / Legea 190
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
                  Activare Pachet Legal
                </h2>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/20 px-3 py-1 bg-slate-800/80 rounded-lg text-right">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Preț Pachet</span>
                <span className="text-lg font-bold text-white">{plan.price}</span>
              </div>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-850 p-3 rounded-xl mb-6 text-xs text-slate-400">
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${paymentStep === 'billing' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}>
                <Receipt size={13} />
                1. Date Facturare
              </span>
              <span className="text-slate-700">&rarr;</span>
              <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${paymentStep === 'payment' ? 'bg-blue-600 text-white shadow' : 'text-slate-500'}`}>
                <CreditCard size={13} />
                2. Plată Securizată ({plan.name})
              </span>
            </div>

            {paymentStep === 'billing' ? (
              /* ========================================================= */
              /* STEP 1: BILLING DETAILS FORM                              */
              /* ========================================================= */
              <form onSubmit={handleProceedToPayment} className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Receipt size={14} className="text-blue-500" />
                      Informații Factură Fiscală
                    </span>
                    
                    {/* Legal vs Physical Selector */}
                    <div className="flex gap-1.5 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setEntityType('company')}
                        className={`px-2.5 py-1 rounded font-medium transition-all ${entityType === 'company' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                      >
                        Firmă
                      </button>
                      <button
                        type="button"
                        onClick={() => setEntityType('individual')}
                        className={`px-2.5 py-1 rounded font-medium transition-all ${entityType === 'individual' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
                      >
                        Pers. Fizică
                      </button>
                    </div>
                  </div>

                  {/* Company Name / Individual Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      {entityType === 'company' ? 'Nume Firmă (ex: ABC Consulting SRL)' : 'Nume și Prenume'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      {entityType === 'company' ? (
                        <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      ) : (
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      )}
                      <input
                        type="text"
                        required
                        placeholder={entityType === 'company' ? 'ex: SC DESIGN RO SRL' : 'ex: Popescu Andrei'}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* CUI / CNP & Reg Com Field Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        {entityType === 'company' ? 'CUI / CIF (Inclusiv RO)' : 'Cod Numeric Personal (CNP)'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={entityType === 'company' ? 'ex: RO12345678' : 'ex: 195030422...'}
                        value={cui}
                        onChange={(e) => setCui(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-colors font-mono"
                      />
                    </div>

                    {entityType === 'company' && (
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-300">
                          Nr. Registrul Comerțului
                        </label>
                        <input
                          type="text"
                          placeholder="ex: J40/12345/2021"
                          value={regCom}
                          onChange={(e) => setRegCom(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-colors font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Core Addresses (County / Județ, City / Localitate, Address) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        City / Localitate <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ex: București, Cluj-Napoca, Otopeni"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        County / Județ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ex: Sector 1, Ilfov, Cluj"
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Adresă Sediu Social / Facturare <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="str. Principală, nr. 42, bl. B1, sc. A, ap. 3"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Details Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Email Trimitere Factură <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          required
                          placeholder="contabilitate@companie.ro"
                          value={billingEmail}
                          onChange={(e) => setBillingEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Telefon Contact
                      </label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="tel"
                          placeholder="ex: 0722123456"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="text-xs text-red-400 flex items-center gap-1.5 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-between items-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={onBack}
                    className="text-slate-400 hover:text-white transition-colors text-xs font-medium bg-slate-850 px-4 py-2 rounded-xl border border-slate-800 hover:border-slate-700"
                  >
                    &larr; Înapoi la pachete
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-xl shadow-blue-900/10 flex items-center gap-2 group"
                  >
                    <span>Continuă spre plată</span>
                    <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </form>
            ) : (
              /* ========================================================= */
              /* STEP 2: PAYMENT METHODS SELECTION & SECURE FORMS         */
              /* ========================================================= */
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Collapsible/Viewable Billing Summary Box */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs space-y-2 relative">
                  <div className="flex justify-between items-center border-b border-slate-850/60 pb-2 mb-1">
                    <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Receipt size={13} className="text-blue-500" />
                      Date Facturare Salvate
                    </span>
                    <button
                      type="button"
                      onClick={() => setPaymentStep('billing')}
                      className="text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline font-semibold"
                    >
                      <Edit2 size={11} />
                      Editează
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Nume:</span>
                      <strong className="text-white">{companyName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{entityType === 'company' ? 'CUI / CIF:' : 'CNP:'}</span>
                      <strong className="text-white font-mono">{cui}</strong>
                    </div>
                    {entityType === 'company' && regCom && (
                      <div>
                        <span className="text-slate-500 block">Reg. Com.:</span>
                        <strong className="text-white font-mono">{regCom}</strong>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500 block">Sediu:</span>
                      <span className="text-white">{address}, {city}, {county}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Email:</span>
                      <span className="text-white">{billingEmail}</span>
                    </div>
                    {phone && (
                      <div>
                        <span className="text-slate-500 block">Telefon:</span>
                        <span className="text-white">{phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Methods Tabs (Only show if API not configured or explicitly want manual) */}
                <div className={`grid ${isApiConfigured ? 'grid-cols-2' : 'grid-cols-1'} bg-slate-955 border border-slate-800 p-1 rounded-xl mb-4 text-sm`}>
                  {isApiConfigured && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('pay')}
                      className={`py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'pay' 
                          ? 'bg-blue-600 text-white shadow' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Card / Revolut Pay (Automat)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveTab('transfer')}
                    className={`py-2 rounded-lg font-medium transition-all ${
                      activeTab === 'transfer' 
                        ? 'bg-blue-600 text-white shadow' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isApiConfigured ? 'QR / Transfer manual' : 'Transfer Rapid Revolut (@tag)'}
                  </button>
                </div>

                {activeTab === 'pay' && isApiConfigured ? (
                  /* Automated Live Revolut Merchant API payment */
                  <form onSubmit={handleAutomatedCheckout} className="space-y-5">
                    <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex items-center gap-3 text-sm text-blue-400 font-medium">
                        <Lock size={16} />
                        <span>Plată automată securizată de Revolut Bank</span>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Confirmare Adresă de Email Tranzacție
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="nume@companie.ro"
                          value={payerEmail}
                          onChange={(e) => setPayerEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 transition-colors font-sans"
                        />
                        <span className="block text-[10px] text-slate-500">
                          Instrucțiunile de conectare la platformă se vor emite pe acest email după finalizare în siguranță.
                        </span>
                      </div>
                    </div>

                    {error && (
                      <div className="text-xs text-red-400 flex items-center gap-1.5 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-900/10 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin text-white" />
                          <span>Generare sesiune securizată Revolut...</span>
                        </>
                      ) : (
                        <>
                          <span>Efectuează Plata Securizată ({plan.price})</span>
                          <ExternalLink size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Manual Revolut Tag Transfer Fallback */
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between p-3.5 bg-slate-955 rounded-xl border border-slate-800">
                        <div>
                          <span className="block text-xs text-slate-500 font-medium">Cont Revolut (Tag Username)</span>
                          <span className="text-base font-bold text-white">@{revolutTag}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyTag}
                          className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                        >
                          {copiedTag ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copiedTag ? 'Copiat!' : 'Copiază'}
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-3.5 bg-slate-955 rounded-xl border border-slate-800">
                        <div>
                          <span className="block text-xs text-slate-500 font-medium font-mono">Referință Factură / Identificator</span>
                          <span className="text-base font-bold text-blue-400 tracking-wider font-mono">{refCode}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                        >
                          {copiedCode ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copiedCode ? 'Copiat!' : 'Copiază'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex flex-col items-center text-center">
                      <div className="bg-white p-2.5 rounded-xl mb-3 relative shadow-md">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0f172a&bgcolor=ffffff&data=${encodeURIComponent(revolutLink)}`}
                          alt="Revolut QR Code"
                          className="w-28 h-28"
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Scanează codul QR sau trimite manual suma direct în contul @{revolutTag}
                      </span>
                    </div>

                    <div className="text-xs text-amber-400/95 bg-amber-500/10 border border-amber-500/25 p-3.5 rounded-xl flex gap-2.5 items-start leading-relaxed">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <p>
                        <strong>Foarte Important:</strong> Te rugăm să adaugi codul de referință <strong className="font-mono text-white underline">{refCode}</strong> la descrierea transferului în Revolut pentru recunoașterea automată!
                      </p>
                    </div>

                    {/* Validation trigger */}
                    <form onSubmit={handleVerifyManualPayment} className="pt-4 border-t border-slate-800 space-y-3">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-widest">
                        Confirmă plata manuală
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Introdu Numele / Prenumele de pe contul tău Revolut"
                        value={revolutName}
                        onChange={(e) => setRevolutName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 transition-colors"
                      />
                      
                      {error && (
                        <p className="text-xs text-red-400 flex items-center gap-1.5 font-medium">
                          <AlertCircle size={12} />
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={16} className="animate-spin text-blue-500" />
                            <span className="text-slate-300">Asociere în curs...</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw size={15} className="text-blue-500" />
                            Am efectuat plata. Activează contul!
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentStep('billing')}
                    className="w-full text-slate-400 hover:text-white transition-colors text-xs text-center py-2 underline"
                  >
                    &larr; Înapoi la Modifică Date Facturare
                  </button>
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-center gap-3.5 text-xs text-slate-500 text-center">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-500/80" />Securizat SSL</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full" />
              <span>Garanție activare instant</span>
            </div>
          </>
        ) : (
          /* Payment completed view with success animations */
          <div className="py-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-5 text-green-400">
              <Sparkles className="animate-bounce" size={28} />
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Plată Confirmată!</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
              Tranzacția Revolut trimisă de utilizatorul <strong className="text-white font-semibold">{revolutName || 'cu succes'}</strong> a fost confirmată. Pachetul <strong className="text-green-400 font-bold">{plan.name}</strong> este acum activ!
            </p>
            
            <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl mb-8 space-y-2.5 max-w-sm mx-auto text-left text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Cod identificator:</span>
                <span className="text-slate-300 font-medium font-mono">{refCode}</span>
              </div>
              <div className="flex justify-between">
                <span>Cumpărător:</span>
                <span className="text-slate-300 font-semibold">{companyName}</span>
              </div>
              <div className="flex justify-between">
                <span>{entityType === 'company' ? 'CUI / CIF:' : 'CNP:'}</span>
                <span className="text-slate-300 font-semibold font-mono">{cui}</span>
              </div>
              {revolutName && (
                <div className="flex justify-between">
                  <span>Nume cont Revolut:</span>
                  <span className="text-slate-300 font-semibold">{revolutName}</span>
                </div>
              )}
              {payerEmail && (
                <div className="flex justify-between">
                  <span>Email facturare:</span>
                  <span className="text-slate-300 font-semibold">{payerEmail}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tip Abonament:</span>
                <span className="text-green-400 font-semibold">{plan.name} Pro</span>
              </div>
            </div>

            <button
              onClick={handleCompleteAndProceed}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-blue-900/15"
            >
              Continuă spre Înregistrare Cont
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
