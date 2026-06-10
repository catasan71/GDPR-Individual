import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {isPrivacy ? <Shield className="text-blue-500" size={24} /> : <FileText className="text-blue-500" size={24} />}
            <h2 className="text-xl font-bold text-white">
              {isPrivacy ? 'Politica de Confidențialitate' : 'Termeni și Condiții'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-slate-300 space-y-6 text-sm leading-relaxed">
          {isPrivacy ? (
            <>
              <p>Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</p>
              
              <section>
                <h3 className="text-lg font-bold text-white mb-2">1. Introducere</h3>
                <p>Respectăm cu strictețe Regulamentul General privind Protecția Datelor (GDPR). Platforma GDPR Rapid este operată de CATALIN MI SANDU PFA, ID: 54552543, cu sediul în Craiova, Strada Infratirii, Nr 15. Această politică explică modul în care colectăm, utilizăm și protejăm datele dumneavoastră atunci când utilizați platforma noastră.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-2">2. Ce date colectăm</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Date de cont:</strong> Adresa de email și parola (criptată).</li>
                  <li><strong>Datele companiei:</strong> Denumire, CUI, număr angajați, detalii operaționale necesare generării documentelor.</li>
                  <li><strong>Date financiare:</strong> Nu stocăm datele cardului bancar. Acestea sunt procesate exclusiv de partenerul nostru de plăți.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-2">3. Securitatea Datelor (Infrastructura noastră)</h3>
                <p>Am implementat măsuri tehnice și organizatorice de top pentru a vă proteja datele:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Criptare:</strong> Toate datele sunt criptate <em>at-rest</em> și <em>in-transit</em> folosind standardul <strong>AES-256</strong>.</li>
                  <li><strong>Găzduire UE:</strong> Baza noastră de date este găzduită exclusiv pe servere aflate pe teritoriul Uniunii Europene, asigurând conformitatea cu normele de transfer de date.</li>
                  <li><strong>Controlul Accesului:</strong> Sistemul nostru folosește reguli stricte (RBAC) - niciun utilizator nu poate accesa datele altei companii.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-2">4. Terți și Subîmputerniciți</h3>
                <p>Pentru a vă oferi acest serviciu, colaborăm cu următorii furnizori de top, toți fiind conformi GDPR:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>Google Cloud / Firebase (Irlanda):</strong> Pentru găzduirea bazei de date și autentificare securizată.</li>
                  <li><strong>Revolut (Marea Britanie/UE):</strong> Pentru procesarea securizată a plăților (furnizor certificat PCI-DSS Level 1).</li>
                  <li><strong>Resend:</strong> Pentru trimiterea email-urilor tranzacționale (ex. resetare parolă, alerte).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-2">5. Drepturile Dumneavoastră</h3>
                <p>Conform GDPR, aveți dreptul de acces, rectificare, ștergere ("dreptul de a fi uitat"), restricționare, portare a datelor și dreptul de a vă opune prelucrării. Vă puteți exercita aceste drepturi direct din contul dumneavoastră sau contactându-ne la adresa de email: <strong>office@developly.pro</strong>.</p>
              </section>
            </>
          ) : (
            <>
              <p>Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}</p>
              
              <section>
                <h3 className="text-lg font-bold text-white mb-2">1. Acceptarea Termenilor</h3>
                <p>Prezenții Termeni și Condiții reglementează utilizarea platformei GDPR Rapid, operată de CATALIN MI SANDU PFA. Prin crearea unui cont și utilizarea platformei noastre, sunteți de acord cu acești Termeni și Condiții. Dacă nu sunteți de acord, vă rugăm să nu utilizați serviciul.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-2">2. Descrierea Serviciului</h3>
                <p>Platforma noastră oferă instrumente software pentru generarea și gestionarea documentației necesare conformării cu Regulamentul (UE) 2016/679 (GDPR) și legislația națională (ex. Legea 190/2018).</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-2">3. Plăți și Abonamente</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Plățile sunt procesate securizat prin intermediul <strong>Revolut</strong>.</li>
                  <li>Abonamentele se reînnoiesc automat lunar, cu excepția cazului în care sunt anulate din contul de utilizator.</li>
                  <li>Facturile sunt emise automat și trimise pe adresa de email asociată contului.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-2">4. Limitarea Răspunderii</h3>
                <p><strong>IMPORTANT:</strong> Deși documentele noastre sunt create pe baza cerințelor legale actuale și a bunelor practici, platforma noastră este un instrument software (SaaS), nu o casă de avocatură. Generarea documentelor nu reprezintă consultanță juridică personalizată. Responsabilitatea finală pentru implementarea corectă a măsurilor GDPR în cadrul organizației dumneavoastră vă aparține.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-2">5. Securitate și Conturi</h3>
                <p>Sunteți responsabil pentru păstrarea confidențialității parolei dumneavoastră. Noi ne asumăm responsabilitatea de a vă proteja datele stocate folosind criptare AES-256 și găzduire în UE, conform Politicii noastre de Confidențialitate.</p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
          >
            Am înțeles
          </button>
        </div>
      </div>
    </div>
  );
};
