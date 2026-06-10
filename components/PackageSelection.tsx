import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '../constants';

interface PackageSelectionProps {
  onSelect: (planId: string) => void;
  onBack: () => void;
}

export const PackageSelection: React.FC<PackageSelectionProps> = ({ onSelect, onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center justify-center">
      <div className="max-w-5xl w-full">
        <button onClick={onBack} className="text-slate-400 hover:text-white mb-8 flex items-center gap-2">
           &larr; Înapoi
        </button>
        <h2 className="text-3xl font-bold text-white text-center mb-12">Alege pachetul potrivit pentru tine</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`relative p-8 rounded-2xl border ${plan.popular ? 'bg-slate-900 border-blue-500 shadow-2xl shadow-blue-900/20' : 'bg-slate-950 border-slate-800'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMANDAT
                </div>
              )}
              <h3 className="text-lg font-medium text-slate-300 mb-2">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-500 mb-1">{plan.period}</span>
              </div>
              <button 
                onClick={() => onSelect(plan.id)}
                className={`w-full py-3 rounded-lg font-bold mb-8 transition-colors ${plan.popular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'}`}
              >
                {plan.cta}
              </button>
              <ul className="space-y-4">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <CheckCircle2 size={18} className="text-blue-500 shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
