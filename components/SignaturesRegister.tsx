import React, { useState } from 'react';
import { User, Plus, Search, FileText, CheckCircle, Calendar, Trash2, X } from 'lucide-react';
import { DocumentItem } from '../types';

interface SignatureRecord {
  id: string;
  employeeName: string;
  cnp: string;
  documentId: string;
  documentTitle: string;
  signDate: string;
  notes: string;
}

interface SignaturesRegisterProps {
  documents: DocumentItem[];
  onClose?: () => void;
}

export const SignaturesRegister: React.FC<SignaturesRegisterProps> = ({ documents, onClose }) => {
  const [records, setRecords] = useState<SignatureRecord[]>([
    {
      id: '1',
      employeeName: 'Ion Popescu',
      cnp: '1800101123456',
      documentId: '3',
      documentTitle: 'Acord de Confidențialitate (NDA) Angajați',
      signDate: '2026-03-15',
      notes: 'Exemplar fizic la dosar HR'
    },
    {
      id: '2',
      employeeName: 'Maria Ionescu',
      cnp: '2850505123456',
      documentId: '2',
      documentTitle: 'Notă de Informare Angajați',
      signDate: '2026-03-16',
      notes: 'Semnat electronic'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state
  const [employeeName, setEmployeeName] = useState('');
  const [cnp, setCnp] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [signDate, setSignDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const filteredRecords = records.filter(r => 
    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.cnp.includes(searchTerm) ||
    r.documentTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = documents.find(d => d.id === selectedDocId);
    if (!doc) return;

    const newRecord: SignatureRecord = {
      id: Date.now().toString(),
      employeeName,
      cnp,
      documentId: selectedDocId,
      documentTitle: doc.title,
      signDate,
      notes
    };

    setRecords([newRecord, ...records]);
    setShowAddModal(false);
    
    // Reset form
    setEmployeeName('');
    setCnp('');
    setSelectedDocId('');
    setNotes('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Ești sigur că vrei să ștergi această înregistrare?')) {
      setRecords(records.filter(r => r.id !== id));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="text-blue-500" />
            Registru Evidență Semnături
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Dovada completării și semnării documentelor GDPR de către angajați/parteneri.
          </p>
        </div>
        {onClose && (
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <X size={20} />
            </button>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col min-h-0">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Caută după nume, CNP sau document..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/20"
          >
            <Plus size={18} />
            Adaugă Înregistrare
          </button>
        </div>

        <div className="flex-1 overflow-auto border border-slate-800 rounded-lg bg-slate-950">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 sticky top-0 z-10 shadow-md">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">Angajat / Persoană</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">CNP / ID</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">Document Semnat</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">Data Semnării</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">Note / Locație Fizică</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 text-right">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nu s-au găsit înregistrări.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                          <User size={16} />
                        </div>
                        <span className="font-medium text-slate-200">{record.employeeName}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-400 font-mono">{record.cnp}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        <span className="text-sm text-slate-300">{record.documentTitle}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar size={14} />
                        {new Date(record.signDate).toLocaleDateString('ro-RO')}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{record.notes || '-'}</td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Șterge înregistrare"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Adaugă Înregistrare Nouă</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddRecord} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Nume și Prenume Angajat/Partener *</label>
                <input 
                  type="text" 
                  required
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="ex: Ion Popescu"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">CNP / ID *</label>
                <input 
                  type="text" 
                  required
                  value={cnp}
                  onChange={(e) => setCnp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="ex: 1800101123456"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Document Semnat *</label>
                <select 
                  required
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 appearance-none"
                >
                  <option value="" disabled>Selectează documentul...</option>
                  {documents.filter(d => d.status === 'generated' || d.status === 'approved').map(doc => (
                    <option key={doc.id} value={doc.id}>{doc.title}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Doar documentele generate apar în această listă.</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Data Semnării *</label>
                <input 
                  type="date" 
                  required
                  value={signDate}
                  onChange={(e) => setSignDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-300">Note / Locație Fizică (Opțional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 resize-none h-20"
                  placeholder="ex: Dosar HR nr. 4, semnat electronic cu DocuSign, etc."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  Anulează
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20"
                >
                  Salvează Înregistrarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
