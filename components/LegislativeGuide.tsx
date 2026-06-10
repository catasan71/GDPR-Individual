
import { Brain, ShieldCheck, Database, Lock, Cookie, Clock, AlertTriangle, Users, RefreshCw, BookOpen, Loader2, CheckCircle2, Gavel, Link as LinkIcon, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { SubscriptionStatus } from '../types';

interface LegislativeGuideProps {
    subscriptionStatus: SubscriptionStatus;
    onSubscribe: () => void;
}

export const LegislativeGuide: React.FC<LegislativeGuideProps> = ({ subscriptionStatus, onSubscribe }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribeClick = () => {
      setIsProcessing(true);
      onSubscribe();
      setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Secțiunea: De ce Abonament Lunar? */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-8 border border-slate-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-medium mb-4">
              <Gavel size={14} />
              <span>Conformitate Activă (Legea 190/2018)</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">GDPR nu este un "dosar" static, ci o stare de fapt.</h2>
            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
              Legislația din România impune condiții specifice pentru CNP (Art. 4) și Monitorizarea Angajaților (Art. 5). O simplă politică descărcată de pe internet te lasă vulnerabil la amenzi de mii de euro.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-colors">
                  <h4 className="font-bold text-white flex items-center gap-2 mb-2">
                     <Clock className="text-orange-400" size={18} /> Monitorizare Legislativă
                  </h4>
                  <p className="text-sm text-slate-400">Te notificăm instant când ANSPDCP publică ghiduri noi sau când se modifică termenele de arhivare în România.</p>
               </div>
               <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 hover:border-green-500/30 transition-colors">
                  <h4 className="font-bold text-white flex items-center gap-2 mb-2">
                     <ShieldCheck className="text-green-400" size={18} /> Garanția Diligenței
                  </h4>
                  <p className="text-sm text-slate-400">Abonamentul dovedește autorităților că ai un proces activ de gestionare a datelor (Responsabilitate - Art. 5.2 GDPR).</p>
               </div>
            </div>
          </div>
          
          <div className="w-full md:w-80 shrink-0">
             <div className={`bg-slate-950 p-6 rounded-xl border shadow-xl transition-all ${subscriptionStatus === 'active' ? 'border-green-500/50 shadow-green-900/20' : 'border-slate-800 shadow-black'}`}>
                <h3 className="text-white font-bold mb-4 border-b border-slate-800 pb-2 flex justify-between items-center">
                    Protecție Juridică
                    {subscriptionStatus === 'active' && <CheckCircle2 className="text-green-500" size={20} />}
                </h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Plan actual:</span>
                      <span className={`font-medium px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${subscriptionStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-white'}`}>
                        {subscriptionStatus === 'active' ? 'Business Pro' : 'Free Trial'}
                      </span>
                   </div>
                   {subscriptionStatus === 'trial' ? (
                       <>
                        <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-900/30">
                            <p className="text-[10px] text-blue-300 uppercase font-bold mb-1">Inclus în abonament:</p>
                            <ul className="text-[11px] text-slate-300 space-y-1">
                                <li>• Analiza de Proporționalitate CCTV</li>
                                <li>• Acte numire DPO (Art. 4 RO)</li>
                                <li>• Audit semestrial automat</li>
                            </ul>
                        </div>
                        <button 
                            onClick={handleSubscribeClick}
                            disabled={isProcessing}
                            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2"
                        >
                            {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'Activează Conformitatea'}
                        </button>
                       </>
                   ) : (
                       <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Monitorizare:</span>
                            <span className="text-green-400 font-bold">ACTIVĂ</span>
                        </div>
                        <p className="text-xs text-slate-500">Documentele tale sunt sincronizate cu Monitorul Oficial.</p>
                       </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 2. Secțiunea: Pilonii Legii 190/2018 (Specific RO) */}
      <div>
         <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-blue-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Specificul Românesc: Legea 190/2018</h2>
         </div>
         
         <div className="grid lg:grid-cols-3 gap-6">
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-red-500/40 transition-colors">
               <div className="p-3 bg-red-500/10 text-red-500 rounded-lg w-fit mb-4"><Users size={24} /></div>
               <h3 className="text-lg font-bold text-white mb-2">Art. 4: Prelucrarea CNP</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                  Dacă prelucrezi CNP-ul pe baza "Interesului Legitim" (nu doar pentru facturare/lege), ești obligat să numești un **DPO** și să implementezi măsuri tehnice de criptare.
               </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-orange-500/40 transition-colors">
               <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg w-fit mb-4"><AlertTriangle size={24} /></div>
               <h3 className="text-lg font-bold text-white mb-2">Art. 5: Monitorizarea Video</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                  Monitorizarea angajaților (CCTV/GPS) necesită consultarea prealabilă a sindicatului, dovezi că alte măsuri au eșuat și o stocare de maxim **30 de zile**.
               </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-blue-500/40 transition-colors">
               <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg w-fit mb-4"><ShieldCheck size={24} /></div>
               <h3 className="text-lg font-bold text-white mb-2">Art. 32: TOM-uri Obligatorii</h3>
               <p className="text-slate-400 text-sm leading-relaxed">
                  Nu este suficient să ai politici pe hârtie. Trebuie să poți dovedi auditul accesului, instruirea personalului și securitatea fizică a arhivelor.
               </p>
            </div>

         </div>
      </div>

      {/* 3. Secțiunea: Resurse Oficiale */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl mt-8">
         <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <LinkIcon className="text-blue-400" size={20} />
            Resurse Oficiale ANSPDCP
         </h3>
         <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-colors group">
               <div>
                  <h4 className="font-bold text-slate-200">Ghidul autorității de control (ANSPDCP)</h4>
                  <p className="text-sm text-slate-500">Document oficial privind aplicarea GDPR pentru operatori.</p>
               </div>
               <a 
                  href="https://www.dataprotection.ro/servlet/ViewDocument?id=1425" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-600/10 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all"
               >
                  <ArrowRight size={20} />
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};
