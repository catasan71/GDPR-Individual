
import React, { useState, useEffect, useMemo } from 'react';
import { DocumentItem, CompanyProfile } from '../types';
import { generateDocumentContent } from '../services/geminiService';
import { ArrowLeft, Save, Loader2, Wand2, FileText, Lock, X, History, RotateCcw, Printer, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface DocumentEditorProps {
  document: DocumentItem;
  profile: CompanyProfile;
  language: 'RO' | 'EN';
  onSave: (docId: string, content: string) => void;
  onBack: () => void;
  isDemo?: boolean; 
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({ document, profile, language, onSave, onBack, isDemo }) => {
  const [content, setContent] = useState(document.content || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showPlaceholders, setShowPlaceholders] = useState(false);

  // State to hold extracted placeholders so they don't disappear while typing
  const [activePlaceholders, setActivePlaceholders] = useState<{id: number, fullMatch: string, description: string, value: string}[]>([]);

  // Extract placeholders whenever content changes significantly (e.g. after generation)
  useEffect(() => {
    const regex = /\[COMPLETA[TȚ]I:?\s*(.*?)\]/gi;
    const matches = [...content.matchAll(regex)];
    
    const uniquePlaceholders = Array.from(new Map(matches.map(match => [match[1].trim(), match])).values());
    
    const newPlaceholders = uniquePlaceholders.map((match, index) => ({
      id: index,
      fullMatch: match[0],
      description: match[1].trim(),
      value: ''
    }));

    setActivePlaceholders(prev => {
        if (newPlaceholders.length === 0) return [];
        
        // Keep existing values for placeholders that still exist
        return newPlaceholders.map(np => {
            const existing = prev.find(p => p.description === np.description);
            return existing ? { ...np, value: existing.value } : np;
        });
    });

    // Auto-show sidebar if we found new placeholders and it was previously empty
    if (newPlaceholders.length > 0 && activePlaceholders.length === 0) {
        setShowPlaceholders(true);
    } else if (newPlaceholders.length === 0) {
        setShowPlaceholders(false);
    }
  }, [content]);

  const handlePlaceholderValueChange = (id: number, newValue: string) => {
    setActivePlaceholders(prev => prev.map(ph => ph.id === id ? { ...ph, value: newValue } : ph));
  };

  const applyPlaceholders = () => {
    let newContent = content;
    activePlaceholders.forEach(ph => {
        if (ph.value.trim() !== '') {
            // Use split.join instead of replaceAll for better browser compatibility
            newContent = newContent.split(ph.fullMatch).join(ph.value);
        }
    });
    setContent(newContent);
  };

  // Auto-generate if empty
  useEffect(() => {
    if (!content && !isGenerating) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    if (isDemo) {
        setTimeout(() => {
            const teaserContent = `
# ${document.title.toUpperCase()}

**NR. ÎNREGISTRARE: ______ / DATA: ${new Date().toLocaleDateString('ro-RO')}**

**CAPITOLUL I. PĂRȚILE**
Subscrisa, **${profile.name}**, persoană juridică română, cu sediul social în [ADRESĂ], înregistrată la Oficiul Registrului Comerțului sub nr. J__/__/__, CUI **${profile.cui}**, reprezentată legal prin Administrator, în calitate de **OPERATOR DE DATE**...

*(Versiune completă disponibilă în planul plătit)*
            `;
            setContent(teaserContent);
            setIsGenerating(false);
        }, 1500);
    } else {
        const text = await generateDocumentContent(document.type, profile, language);
        setContent(text);
        setIsGenerating(false);
    }
  };

  const handleAction = (action: () => void) => {
      if (isDemo) {
          setShowPaywall(true);
      } else {
          action();
      }
  }

  const handleExportWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${document.title}</title></head>
      <body><h1>${document.title}</h1><pre>${content}</pre></body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title.replace(/[^a-z0-9]/gi, '_')}.doc`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handlePrint = () => {
    setMode('preview');
    setTimeout(() => window.print(), 100);
  };

  const handleRestore = (oldContent: string) => {
      if (window.confirm('Ești sigur că vrei să restaurezi această versiune? Conținutul actual va fi salvat în istoric.')) {
          setContent(oldContent);
          setShowHistory(false);
      }
  }

  return (
    <div className="relative h-[calc(100vh-140px)] flex bg-slate-900 rounded-xl border border-slate-700 overflow-hidden print:h-auto print:border-none print:bg-white print:text-black print:overflow-visible">
      
      {/* PAYWALL MODAL */}
      {showPaywall && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
                  <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                      <X size={24} />
                  </button>
                  <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center text-blue-500">
                          <Lock size={32} />
                      </div>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-white mb-2">Funcție Premium</h3>
                  <p className="text-slate-400 text-center mb-8">
                      În modul Demo, nu poți salva sau exporta. Abonează-te pentru acces complet.
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all">
                      Vezi Planurile
                  </button>
              </div>
          </div>
      )}

      {/* LEFT CONTENT (EDITOR) */}
      <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center print:hidden">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="font-bold text-white flex items-center gap-2 truncate max-w-[200px] sm:max-w-md">
                    {document.title}
                    {isDemo && <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded border border-orange-500/30">DEMO</span>}
                </h2>
                <div className="flex gap-2 mt-1">
                    <button onClick={() => setMode('edit')} className={`text-xs px-2 py-1 rounded ${mode === 'edit' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>Editor</button>
                    <button onClick={() => setMode('preview')} className={`text-xs px-2 py-1 rounded ${mode === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>Preview</button>
                    <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded bg-slate-700/50 border border-slate-600">
                        <span className="text-xs text-slate-400">Limbă:</span>
                        <span className="text-xs font-bold text-white">{language}</span>
                    </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowPlaceholders(!showPlaceholders)}
                className={`p-2 rounded-lg transition-colors ${showPlaceholders ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                title="Editează Câmpuri"
              >
                  <Edit3 size={20} />
              </button>

              <button 
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
                title="Istoric Versiuni"
              >
                  <History size={20} />
              </button>

              <div className="h-6 w-px bg-slate-700 mx-1 hidden sm:block"></div>

              <button onClick={handleGenerate} disabled={isGenerating} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-sm hover:bg-indigo-600/30 transition-colors">
                {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
              </button>

              <button onClick={() => handleAction(handleExportWord)} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors">
                <FileText size={16} />
              </button>

              <button onClick={() => handleAction(handlePrint)} className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm transition-colors" title="Export PDF / Print">
                <Printer size={16} />
              </button>

              <button onClick={() => handleAction(() => onSave(document.id, content))} className="ml-2 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
                <Save size={16} />
                <span className="hidden sm:inline">Salvează</span>
              </button>
            </div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 overflow-auto bg-slate-950 print:bg-white print:text-black relative">
            {isDemo && !isGenerating && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none overflow-hidden">
                    <div className="rotate-[-45deg] text-9xl font-bold text-white whitespace-nowrap">DEMO PREVIEW</div>
                </div>
            )}

            {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <Loader2 size={40} className="animate-spin text-blue-500" />
                    <p>Consultantul AI redactează documentul în limba {language}...</p>
                </div>
            ) : mode === 'edit' ? (
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    readOnly={isDemo}
                    className={`w-full h-full bg-slate-950 text-slate-300 p-8 font-mono text-sm resize-none focus:outline-none ${isDemo ? 'cursor-not-allowed opacity-80' : ''}`}
                    placeholder="Conținut..."
                />
            ) : (
                <div className="relative">
                    <div className="prose prose-invert max-w-3xl mx-auto p-8 prose-headings:text-slate-100 prose-a:text-blue-400 print:prose-black print:text-black print:max-w-none">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                </div>
            )}
          </div>
      </div>

      {/* RIGHT SIDEBAR (PLACEHOLDERS) */}
      <div className={`w-80 bg-slate-900 border-l border-slate-800 flex flex-col transition-all duration-300 absolute right-0 top-0 bottom-0 z-20 shadow-2xl ${showPlaceholders ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <Edit3 size={18} className="text-blue-500" />
                  Câmpuri de Completat
              </h3>
              <button onClick={() => setShowPlaceholders(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
              </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activePlaceholders.length === 0 ? (
                  <div className="text-center text-slate-500 mt-10">
                      <p className="text-sm">Nu există câmpuri de completat.</p>
                  </div>
              ) : (
                  <>
                    <p className="text-xs text-slate-400 mb-4">Completează datele lipsă și apasă "Aplică" pentru a le insera în document.</p>
                    {activePlaceholders.map((ph) => (
                        <div key={ph.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                            <label className="block text-xs font-bold text-slate-300 mb-2">{ph.description}</label>
                            <input 
                                type="text"
                                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                placeholder={`Introduceți ${ph.description}...`}
                                value={ph.value}
                                onChange={(e) => handlePlaceholderValueChange(ph.id, e.target.value)}
                            />
                        </div>
                    ))}
                    <button 
                        onClick={applyPlaceholders}
                        className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Aplică Datele în Document
                    </button>
                  </>
              )}
          </div>
      </div>

      {/* RIGHT SIDEBAR (HISTORY) */}
      <div className={`w-80 bg-slate-900 border-l border-slate-800 flex flex-col transition-all duration-300 absolute right-0 top-0 bottom-0 z-20 shadow-2xl ${showHistory ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <h3 className="font-bold text-white flex items-center gap-2">
                  <History size={18} className="text-blue-500" />
                  Istoric Versiuni
              </h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white">
                  <X size={20} />
              </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!document.history || document.history.length === 0 ? (
                  <div className="text-center text-slate-500 mt-10">
                      <History size={40} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Nu există versiuni anterioare.</p>
                      <p className="text-xs mt-1">Salvează documentul pentru a începe istoricul.</p>
                  </div>
              ) : (
                  document.history.map((version) => (
                      <div key={version.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-blue-500/30 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold text-slate-300">
                                  {new Date(version.date).toLocaleDateString('ro-RO')}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                  {new Date(version.date).toLocaleTimeString('ro-RO', {hour: '2-digit', minute:'2-digit'})}
                              </span>
                          </div>
                          <p className="text-xs text-blue-400 mb-3 bg-blue-900/20 px-2 py-1 rounded inline-block">
                              {version.reason}
                          </p>
                          <button 
                              onClick={() => handleRestore(version.content)}
                              className="w-full flex items-center justify-center gap-2 text-xs bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition-colors"
                          >
                              <RotateCcw size={12} />
                              Restaurează
                          </button>
                      </div>
                  ))
              )}
          </div>
      </div>

    </div>
  );
};
