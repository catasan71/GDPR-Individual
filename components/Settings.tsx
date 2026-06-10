
import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { INDUSTRIES } from '../constants';
import { Save, Building2, Globe, Database, ShieldAlert } from 'lucide-react';

interface SettingsProps {
  profile: CompanyProfile;
  onUpdate: (profile: CompanyProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState<CompanyProfile>(profile);
  const [message, setMessage] = useState('');

  const handleSave = () => {
    onUpdate(formData);
    setMessage('Setările au fost actualizate cu succes!');
    setTimeout(() => setMessage(''), 3000);
  };

  const updateField = (key: keyof CompanyProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Setări Firmă & Profil GDPR</h2>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          <Save size={18} />
          Salvează Modificările
        </button>
      </div>

      {message && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Building2 size={24} />
            <h3 className="text-lg font-semibold">Date Identificare</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Nume Companie</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">CUI</label>
              <input 
                type="text" 
                value={formData.cui}
                onChange={(e) => updateField('cui', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Industrie</label>
              <select 
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
              >
                {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Nr. Angajați</label>
              <input 
                type="number" 
                value={formData.employeeCount}
                onChange={(e) => updateField('employeeCount', parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Digital Presence */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4 text-purple-400">
            <Globe size={24} />
            <h3 className="text-lg font-semibold">Prezență Digitală</h3>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col p-3 bg-slate-950 rounded-lg border border-slate-800 gap-3">
               <div className="flex items-center justify-between">
                  <span className="text-slate-300">Website Activ</span>
                  <input 
                    type="checkbox" 
                    checked={formData.hasWebsite}
                    onChange={(e) => updateField('hasWebsite', e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 bg-slate-800 border-slate-600"
                  />
               </div>
               {formData.hasWebsite && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">URL Website</label>
                    <input 
                      type="url" 
                      value={formData.websiteUrl || ''}
                      onChange={(e) => updateField('websiteUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-blue-500 outline-none"
                    />
                  </div>
               )}
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-300">Newsletter / Marketing</span>
              <input 
                type="checkbox" 
                checked={formData.hasNewsletter}
                onChange={(e) => updateField('hasNewsletter', e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 bg-slate-800 border-slate-600"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-300">Supraveghere Video (CCTV)</span>
              <input 
                type="checkbox" 
                checked={formData.hasCCTV}
                onChange={(e) => updateField('hasCCTV', e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 bg-slate-800 border-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Sensitive Data */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-red-400">
            <ShieldAlert size={24} />
            <h3 className="text-lg font-semibold">Date Sensibile & Terți</h3>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-4 p-4 border border-red-900/30 bg-red-900/10 rounded-lg">
                <input 
                  type="checkbox" 
                  checked={formData.processSensitiveData}
                  onChange={(e) => updateField('processSensitiveData', e.target.checked)}
                  className="w-6 h-6 rounded text-red-600 bg-slate-800 border-slate-600"
                />
                <div>
                  <span className="block text-red-200 font-medium">Prelucrare Date Sensibile</span>
                  <span className="text-sm text-red-300/60">Date medicale, biometrice, minori, cazier, etnie, politică etc.</span>
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Servicii Terțe (Procesatori)</label>
                <div className="flex gap-2 mb-2">
                   <Database size={16} className="text-slate-500" />
                   <span className="text-xs text-slate-500">Listați furnizorii care au acces la date (IT, Cloud, Contabilitate)</span>
                </div>
                <textarea 
                  value={formData.thirdPartyServices.join(', ')}
                  onChange={(e) => updateField('thirdPartyServices', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none resize-none"
                  placeholder="ex: Google Analytics, Facebook Pixel, SmartBill, Firma Contabilitate SRL"
                />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
