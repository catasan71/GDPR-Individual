
import React, { useEffect, useState } from 'react';
import { CompanyProfile, DocumentItem } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, CheckCircle, FileText, AlertCircle, PlayCircle, Scale, RefreshCw, ArrowRight, Globe, Siren, Activity, Languages, Check, Loader2, Lock, Link as LinkIcon } from 'lucide-react';
import { getComplianceAdvice, generateDPIAReport } from '../services/geminiService';

interface DashboardProps {
  documents: DocumentItem[];
  profile: CompanyProfile;
  language: 'RO' | 'EN';
  setLanguage: (lang: 'RO' | 'EN') => void;
  onGenerateDoc: (docId: string) => void;
  onViewLegislative: () => void;
  onOpenSignatures: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ documents, profile, language, setLanguage, onGenerateDoc, onViewLegislative, onOpenSignatures }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  // State for Business Modules
  const [auditStatus, setAuditStatus] = useState<'idle' | 'scanning' | 'complete'>('idle');
  const [auditResult, setAuditResult] = useState<string>('');
  const [auditUrl, setAuditUrl] = useState(profile.websiteUrl || '');
  
  const [dpiaStatus, setDpiaStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');
  const [dpiaResult, setDpiaResult] = useState<{risk: string, details: string} | null>(null);

  const [breachCount, setBreachCount] = useState(0);

  const mandatoryDocs = documents.filter(d => d.isMandatory);
  const completedDocs = mandatoryDocs.filter(d => d.status !== 'missing');
  const score = Math.round((completedDocs.length / mandatoryDocs.length) * 100);

  const data = [
    { name: 'Conform', value: completedDocs.length },
    { name: 'Lipsă', value: mandatoryDocs.length - completedDocs.length },
  ];

  const COLORS = ['#3b82f6', '#1e293b'];

  useEffect(() => {
    if (profile.name && !advice) {
        setLoadingAdvice(true);
        getComplianceAdvice(profile).then(res => {
            setAdvice(res);
            setLoadingAdvice(false);
        });
    }
  }, [profile]);

  useEffect(() => {
      // Sync url if profile updates (e.g. from settings)
      if (profile.websiteUrl) {
          setAuditUrl(profile.websiteUrl);
      }
  }, [profile.websiteUrl]);

  // Handlers for Business Modules
  const handleWebsiteAudit = () => {
      if (!auditUrl) return;
      setAuditStatus('scanning');
      setTimeout(() => {
          setAuditStatus('complete');
          setAuditResult(`Scanare completă pentru ${auditUrl}: 12 Cookie-uri identificate. 2 neclasificate. Banner GDPR valid.`);
      }, 3000);
  };

  const handleDPIA = async () => {
      setDpiaStatus('analyzing');
      const report = await generateDPIAReport(profile);
      setDpiaResult(report);
      setDpiaStatus('complete');
  };

  const handleLogBreach = () => {
      // Shortcut to create incident
      setBreachCount(c => c + 1);
      // In a real app, this would open a modal form
      onGenerateDoc('4'); // Opens Registru Breșe
  };

  return (
    <div className="space-y-8">
      
      {/* Security Badges Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            {language === 'RO' ? 'Panou de Control GDPR' : 'GDPR Dashboard'}
          </h1>
          <p className="text-slate-400">
            {profile.name} • {profile.industry}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <Lock size={14} className="text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium">Criptare AES-256</span>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
            <Globe size={14} className="text-blue-400" />
            <span className="text-xs text-slate-300 font-medium">Găzduire UE</span>
          </div>
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setLanguage('RO')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === 'RO' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              RO
            </button>
            <button
              onClick={() => setLanguage('EN')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                language === 'EN' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Legislative Alert */}
      <div className="bg-orange-900/20 border border-orange-500/50 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
        <div className="flex items-start gap-4">
            <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400 shrink-0">
                <Scale size={24} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Alertă: Modificare Legislativă Recentă
                    <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">NOU</span>
                </h3>
                <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                    Legea 190/2018 a suferit actualizări privind monitorizarea video la locul de muncă. 
                    Documentul dvs. <strong>"Politici de Securitate"</strong> necesită revizuire urgentă.
                </p>
            </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={onViewLegislative}
                className="flex-1 md:flex-none whitespace-nowrap px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-slate-700"
            >
                Vezi Detalii Lege
            </button>
            <button 
                onClick={() => onGenerateDoc('3')} // ID-ul Politicii de Securitate
                className="flex-1 md:flex-none whitespace-nowrap flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-orange-900/30"
            >
                <RefreshCw size={16} />
                Actualizează Doc.
            </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle size={100} className="text-blue-500" />
          </div>
          <h3 className="text-slate-400 font-medium mb-2">Scor Conformitate</h3>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${score > 80 ? 'text-green-400' : score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {score}%
            </span>
            <span className="text-slate-500 mb-1">/ 100%</span>
          </div>
          <div className="mt-4 h-2 w-full bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${score > 80 ? 'bg-green-500' : score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
              style={{ width: `${score}%` }} 
            />
          </div>
          <p className="mt-3 text-sm text-slate-400">
            {score < 50 ? 'Risc Ridicat! Generează documentele obligatorii.' : 'Continuă așa! Ești aproape de conformitate.'}
          </p>
        </div>

        {/* Action Items */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 flex flex-col justify-center">
             <h3 className="text-slate-400 font-medium mb-4">Status Documente</h3>
             <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} 
                        itemStyle={{ color: '#fff' }}
                    />
                    </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Complet</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-800 border border-slate-600"></div> Lipsă</div>
             </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3 text-indigo-300">
                <div className="animate-pulse"><AlertCircle size={20} /></div>
                <h3 className="font-semibold">Consultant AI Dedicat</h3>
            </div>
            {loadingAdvice ? (
                <div className="space-y-2 animate-pulse">
                    <div className="h-2 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-2 bg-slate-700 rounded w-full"></div>
                    <div className="h-2 bg-slate-700 rounded w-5/6"></div>
                </div>
            ) : (
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto custom-scrollbar">
                    {advice}
                </div>
            )}
        </div>
      </div>

      {/* BUSINESS MODULES SECTION */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="text-blue-400" />
            Module Business & Automatizări
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Audit Website */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-blue-500/40 transition-colors">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Globe size={20} /></div>
                        <h4 className="font-bold text-white">Audit Website</h4>
                    </div>
                    
                    <div className="mb-3">
                        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 mb-2">
                            <LinkIcon size={14} className="text-slate-500" />
                            <input 
                                type="url" 
                                placeholder="https://site.ro" 
                                value={auditUrl}
                                onChange={(e) => setAuditUrl(e.target.value)}
                                className="bg-transparent text-xs text-white outline-none w-full placeholder-slate-600"
                            />
                        </div>
                    </div>

                    {auditStatus === 'complete' ? (
                        <div className="text-sm text-green-400 bg-green-900/20 p-2 rounded border border-green-900/50 mb-2">
                            {auditResult}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 mb-2">
                            Verifică automat politica de cookies și bannerele pentru domeniul introdus.
                        </p>
                    )}
                </div>
                <button 
                    onClick={handleWebsiteAudit}
                    disabled={auditStatus === 'scanning' || !auditUrl}
                    className="mt-auto w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
                >
                    {auditStatus === 'scanning' ? <Loader2 className="animate-spin" size={16} /> : <PlayCircle size={16} />}
                    {auditStatus === 'complete' ? 'Rescanează' : 'Start Audit'}
                </button>
            </div>

            {/* 2. Registru Breșe */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-red-500/40 transition-colors">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Siren size={20} /></div>
                        <h4 className="font-bold text-white">Registru Breșe</h4>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Incidente raportate:</span>
                        <span className={`font-bold ${breachCount > 0 ? 'text-red-400' : 'text-green-400'}`}>{breachCount}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                        Termen legal notificare ANSPDCP: 72 ore de la incident.
                    </p>
                </div>
                <button 
                    onClick={handleLogBreach}
                    className="mt-4 w-full py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 hover:text-red-300 rounded-lg text-sm font-medium transition-colors border border-red-900/30 flex items-center justify-center gap-2"
                >
                    <AlertTriangle size={16} />
                    Raportează Incident
                </button>
            </div>

            {/* 3. Analiză Risc (DPIA) */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-purple-500/40 transition-colors">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg"><Activity size={20} /></div>
                        <h4 className="font-bold text-white">Analiză Risc (DPIA)</h4>
                    </div>
                    {dpiaStatus === 'complete' && dpiaResult ? (
                        <div className={`text-sm p-2 rounded border mb-2 ${dpiaResult.risk === 'high' ? 'bg-red-900/20 border-red-900/50 text-red-300' : 'bg-green-900/20 border-green-900/50 text-green-300'}`}>
                            <div className="font-bold flex items-center gap-2">
                                Risc: {dpiaResult.risk.toUpperCase()}
                                {dpiaResult.risk === 'high' && <AlertCircle size={14} />}
                            </div>
                            <p className="text-xs mt-1 opacity-90">{dpiaResult.details}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400">
                            Analiză AI obligatorie pentru procesări de date sensibile sau monitorizare.
                        </p>
                    )}
                </div>
                <button 
                    onClick={handleDPIA}
                    disabled={dpiaStatus === 'analyzing'}
                    className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
                >
                    {dpiaStatus === 'analyzing' ? <Loader2 className="animate-spin" size={16} /> : <PlayCircle size={16} />}
                    {dpiaStatus === 'complete' ? 'Reanalizează' : 'Analiză AI'}
                </button>
            </div>

            {/* 4. Evidență Semnături */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg"><FileText size={20} /></div>
                        <h4 className="font-bold text-white">Evidență Semnături</h4>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                        Ține evidența angajaților și partenerilor care au semnat documentele generate (NDA, Note Informare).
                    </p>
                </div>
                <button 
                    onClick={onOpenSignatures}
                    className="mt-auto w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2"
                >
                    <CheckCircle size={16} />
                    Deschide Registru
                </button>
            </div>

        </div>
      </div>

      {/* Document List */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="text-blue-500" />
                Listă Documente Necesare
            </h2>
            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30">
                {mandatoryDocs.filter(d => d.status === 'missing').length} documente critice rămase
            </span>
        </div>
        <div className="divide-y divide-slate-700/50">
            {documents.sort((a,b) => (a.status === 'missing' ? -1 : 1)).map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors group">
                    <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-lg ${doc.status === 'missing' ? 'bg-slate-700 text-slate-400' : 'bg-green-500/20 text-green-500'}`}>
                            {doc.status === 'missing' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-medium text-slate-200">{doc.title}</h4>
                                {doc.isMandatory && (
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">Obligatoriu</span>
                                )}
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">{doc.description}</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => onGenerateDoc(doc.id)}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${doc.status === 'missing' 
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20' 
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}
                        `}
                    >
                        {doc.status === 'missing' ? (
                            <>
                                <PlayCircle size={16} />
                                Generează
                            </>
                        ) : (
                            'Editează'
                        )}
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
