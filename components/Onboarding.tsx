
import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { ArrowRight, CheckCircle2, Building2, Users, Database, Globe, ShieldAlert } from 'lucide-react';
import { INDUSTRIES } from '../constants';

interface OnboardingProps {
  onComplete: (profile: CompanyProfile) => void;
}

const steps = [
  { id: 1, title: 'Detalii Firmă', icon: Building2 },
  { id: 2, title: 'Dimensiune', icon: Users },
  { id: 3, title: 'Online & Digital', icon: Globe },
  { id: 4, title: 'Date Specifice', icon: Database },
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<Partial<CompanyProfile>>(() => {
    let initialName = '';
    let initialCui = '';
    let parsedBilling = undefined;

    try {
      const stored = localStorage.getItem('payer_billing_details');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsedBilling = parsed;
        initialName = parsed.companyName || '';
        initialCui = parsed.cui || '';
      }
    } catch (e) {
      console.error('Error prefilling onboarding from storage:', e);
    }

    return {
      name: initialName,
      cui: initialCui,
      thirdPartyServices: [],
      processSensitiveData: false,
      processCNPLegitimateInterest: false,
      hasWebsite: false,
      websiteUrl: '',
      hasNewsletter: false,
      hasCCTV: false,
      billingDetails: parsedBilling
    };
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(c => c + 1);
    } else {
      onComplete(data as CompanyProfile);
    }
  };

  const updateData = (key: keyof CompanyProfile, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
            Configurare GDPR Rapid
          </h1>
          <p className="text-slate-400">Răspunde la câteva întrebări pentru conformitate 100% cu Legea 190/2018.</p>
        </div>

        <div className="flex justify-between mb-8 px-4">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                ${currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' 
                  : 'bg-slate-900 border-slate-700 text-slate-500'}
              `}>
                <step.icon size={18} />
              </div>
              <span className={`text-xs font-medium ${currentStep >= step.id ? 'text-blue-400' : 'text-slate-600'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Nume Companie (Legal)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ex: SC EXEMPLU SRL"
                  value={data.name || ''}
                  onChange={(e) => updateData('name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Cod Unic de Înregistrare (CUI)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="RO123456"
                  value={data.cui || ''}
                  onChange={(e) => updateData('cui', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Industrie Principală</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={data.industry || ''}
                  onChange={(e) => updateData('industry', e.target.value)}
                >
                  <option value="">Selectează...</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Număr de Angajați</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={data.employeeCount || ''}
                  onChange={(e) => updateData('employeeCount', parseInt(e.target.value))}
                />
              </div>
              
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 bg-slate-700"
                    checked={data.hasCCTV}
                    onChange={(e) => updateData('hasCCTV', e.target.checked)}
                  />
                  <div>
                    <span className="block text-white font-medium">Supraveghere Video sau GPS</span>
                    <span className="text-xs text-slate-400">Există camere la sediu sau monitorizare mașini? (Art. 5 Legea 190)</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid gap-4">
                <div 
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${data.hasWebsite ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-800/50 border-slate-700'}`}
                >
                  <div className="flex items-center gap-3" onClick={() => updateData('hasWebsite', !data.hasWebsite)}>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${data.hasWebsite ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                      {data.hasWebsite && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <div>
                      <span className="block text-white font-medium">Deținem un Website</span>
                      <span className="text-xs text-slate-400">Necesită Politică Cookies și Termeni</span>
                    </div>
                  </div>
                  {data.hasWebsite && (
                    <div className="mt-3 animate-in fade-in slide-in-from-top-2 ml-9">
                        <input 
                        type="url" 
                        placeholder="https://www.site-ul-tau.ro"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={data.websiteUrl || ''}
                        onChange={(e) => updateData('websiteUrl', e.target.value)}
                        />
                    </div>
                  )}
                </div>

                <div 
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${data.hasNewsletter ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-800/50 border-slate-700'}`}
                  onClick={() => updateData('hasNewsletter', !data.hasNewsletter)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${data.hasNewsletter ? 'bg-blue-500 border-blue-500' : 'border-slate-500'}`}>
                      {data.hasNewsletter && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <div>
                      <span className="block text-white font-medium">Trimitem Newsletter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

           {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-4 bg-red-900/20 rounded-xl border border-red-900/50">
                <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                    <ShieldAlert size={18} />
                    Date cu Risc (Legea 190)
                </h3>
                <p className="text-sm text-red-200/70 mb-4">
                  Prelucrați CNP-ul pe baza "interesului legitim" (ex: pentru recuperarea creanțelor)? În România, acest lucru obligă numirea unui DPO.
                </p>
                 <div className="flex gap-4">
                  <button 
                    onClick={() => updateData('processCNPLegitimateInterest', true)}
                    className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-all ${data.processCNPLegitimateInterest ? 'bg-red-600 border-red-600 text-white' : 'bg-transparent border-slate-600 text-slate-400'}`}
                  >
                    DA (Avem CNP)
                  </button>
                  <button 
                    onClick={() => updateData('processCNPLegitimateInterest', false)}
                    className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-all ${!data.processCNPLegitimateInterest ? 'bg-green-600 border-green-600 text-white' : 'bg-transparent border-slate-600 text-slate-400'}`}
                  >
                    NU
                  </button>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Servicii Terțe (DPA necesar)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="ex: Google, Contabilitate SRL, Hostico"
                  onChange={(e) => updateData('thirdPartyServices', e.target.value.split(',').map(s => s.trim()))}
                />
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between">
            <button 
              onClick={() => setCurrentStep(c => Math.max(1, c - 1))}
              className={`px-6 py-2 rounded-lg text-slate-400 hover:text-white transition-colors ${currentStep === 1 ? 'opacity-0 cursor-default' : 'opacity-100'}`}
              disabled={currentStep === 1}
            >
              Înapoi
            </button>
            <button 
              onClick={handleNext}
              disabled={!data.name || !data.cui || (currentStep === 1 && !data.industry)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length ? 'Finalizează Planul' : 'Următorul'}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
