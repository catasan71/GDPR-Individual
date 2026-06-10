
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { ShieldCheck, FileText, Lock, CheckCircle2, ArrowRight, ChevronDown, ChevronUp, RefreshCw, Scale, Users, History, XCircle, Award, X, Cookie, Eye, Server } from 'lucide-react';
import { PRICING_PLANS, FAQS } from '../constants';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onDemo: () => void;
  currentUser?: any;
  onContinueOnboarding?: () => void;
  onLogout?: () => void;
}

type LegalPageType = 'terms' | 'privacy' | 'cookies' | null;

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onLogin, 
  onDemo,
  currentUser,
  onContinueOnboarding,
  onLogout
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeLegal, setActiveLegal] = useState<LegalPageType>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const LegalModal = () => {
    if (!activeLegal) return null;

    const getContent = () => {
        switch(activeLegal) {
            case 'terms':
                return (
                    <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
                        <div className="bg-slate-800 p-4 rounded-lg border-l-4 border-blue-500 mb-6">
                            <h4 className="font-bold text-white mb-1">Clauza de Exonerare (Disclaimer) IMPORTANTĂ</h4>
                            <p>Platforma GDPR Rapid oferă instrumente software de asistență (SaaS) pentru generarea de documentație, nu consultanță juridică personalizată. Utilizarea platformei nu creează o relație avocat-client. Deși algoritmii noștri sunt actualizați conform legislației în vigoare, responsabilitatea finală pentru conformitatea și implementarea corectă a măsurilor GDPR revine exclusiv Utilizatorului. Vă recomandăm ferm să revizuiți documentele generate împreună cu un consilier juridic specializat înainte de implementare.</p>
                        </div>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">1. Introducere și Acceptare</h3>
                            <p>Prezenții Termeni și Condiții ("Termenii") reglementează accesul și utilizarea platformei GDPR Rapid ("Platforma"), operată de CATALIN MI SANDU PFA, ID: 54552543, cu sediul în Craiova, Strada Infratirii, Nr 15 ("Noi", "Compania"). Prin crearea unui cont, bifarea căsuței de acceptare și utilizarea serviciilor noastre, încheiați un contract valabil din punct de vedere juridic și confirmați că ați citit, înțeles și acceptat integral acești Termeni.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">2. Descrierea și Disponibilitatea Serviciilor</h3>
                            <p>Platforma permite generarea automată a documentației GDPR pe baza datelor introduse de Utilizator. Documentele sunt generate "așa cum sunt" (as-is). Compania nu garantează disponibilitatea neîntreruptă a Platformei (SLA 100%) și își rezervă dreptul de a suspenda temporar accesul pentru mentenanță, fără a datora despăgubiri.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">3. Contul de Utilizator și Securitatea</h3>
                            <p>Sunteți responsabil pentru acuratețea datelor furnizate și pentru păstrarea confidențialității credențialelor. Orice acțiune efectuată din contul dvs. este prezumată a fi efectuată de dvs. Ne rezervăm dreptul de a suspenda sau șterge conturile care încalcă acești Termeni sau care prezintă activități suspecte, fără notificare prealabilă.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">4. Plăți, Abonamente și Rambursări</h3>
                            <p>Accesul la funcțiile premium se face pe bază de abonament. Plățile sunt procesate securizat prin intermediul procesatorului autorizat Revolut. Abonamentul se reînnoiește automat la sfârșitul perioadei de facturare. Sumele plătite în avans nu sunt rambursabile, cu excepția cazurilor prevăzute imperativ de legea română. Neplata la termen atrage suspendarea automată a accesului la funcțiile premium.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">5. Proprietate Intelectuală</h3>
                            <p>Platforma, codul sursă, designul, algoritmii și șabloanele de documente sunt proprietatea exclusivă a CATALIN MI SANDU PFA, protejate de legea drepturilor de autor. Utilizatorul primește o licență limitată, neexclusivă, netransferabilă și revocabilă de a utiliza documentele generate strict pentru uzul intern al propriei companii. Este strict interzisă copierea, modificarea, ingineria inversă, revânzarea sau distribuirea șabloanelor noastre către terți.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">6. Limitarea Răspunderii și Despăgubiri</h3>
                            <p>În măsura maximă permisă de lege, CATALIN MI SANDU PFA, administratorii, angajații și afiliații săi nu vor fi răspunzători pentru niciun fel de daune directe, indirecte, incidentale, speciale sau de consecință, inclusiv, dar fără a se limita la: amenzi aplicate de ANSPDCP sau alte autorități, pierderi de profit, de date sau de imagine, rezultate din utilizarea sau incapacitatea de a utiliza Platforma. Răspunderea noastră totală și cumulată, indiferent de cauza acțiunii, nu va depăși suma totală plătită de dvs. către noi în ultimele 6 luni anterioare evenimentului care a generat dauna. Vă obligați să despăgubiți și să exonerați de răspundere Compania împotriva oricăror pretenții ale terților rezultate din utilizarea abuzivă a Platformei de către dvs.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">7. Forță Majoră</h3>
                            <p>Niciuna dintre părți nu va fi răspunzătoare pentru neexecutarea obligațiilor sale dacă o astfel de neexecutare este cauzată de un eveniment de forță majoră, așa cum este definit de legea română (ex: dezastre naturale, război, atacuri cibernetice masive, întreruperi ale rețelelor de telecomunicații).</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">8. Clauza de Salvgardare (Divizibilitate)</h3>
                            <p>Dacă orice prevedere a acestor Termeni este declarată nulă, nelegală sau inopozabilă de către o instanță competentă, celelalte prevederi vor rămâne în deplină vigoare și efect, iar prevederea nulă va fi înlocuită cu una validă care să reflecte cât mai fidel intenția economică inițială.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">9. Legea Aplicabilă și Soluționarea Litigiilor</h3>
                            <p>Prezenții Termeni sunt guvernați exclusiv de legea română. Orice litigiu va fi soluționat pe cale amiabilă. În caz de eșec, competența exclusivă de soluționare revine instanțelor judecătorești competente material din Craiova, România.</p>
                        </section>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
                        <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30 mb-6">
                            <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><Server size={18}/> Rolurile noastre GDPR (Operator vs. Împuternicit)</h4>
                            <p className="mb-2">Pentru a asigura o conformitate strictă și a vă proteja în caz de audit ANSPDCP, clarificăm rolurile noastre juridice:</p>
                            <ul className="list-disc ml-5 space-y-1">
                                <li><strong>Noi suntem OPERATOR</strong> pentru datele dvs. de cont (nume administrator, email, date de facturare, log-uri de acces). Noi decidem scopul și mijloacele prelucrării acestor date pentru a vă oferi serviciul.</li>
                                <li><strong>Noi suntem ÎMPUTERNICIT (Processor)</strong> pentru datele pe care le introduceți în Platformă pentru a genera documentele (ex: numele angajaților dvs., partenerii dvs.). Dvs. rămâneți Operatorul acestor date, iar noi le prelucrăm strict la instrucțiunile dvs. documentate, exclusiv pentru generarea și stocarea documentelor.</li>
                            </ul>
                        </div>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">1. Ce date cu caracter personal prelucrăm?</h3>
                            <p>În calitate de Operator, colectăm: date de identificare (nume, prenume), date de contact (adresă de e-mail, număr de telefon), date de facturare (adresă, CUI/CNP, funcție), date tehnice (adresa IP, tip browser, sistem de operare, log-uri de autentificare, UUID) și date privind comportamentul de utilizare a Platformei.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">2. Scopurile și Temeiurile Legale (Art. 6 GDPR)</h3>
                            <ul className="list-disc ml-5 space-y-1">
                                <li><strong>Executarea contractului (Art. 6(1)(b)):</strong> Crearea contului, furnizarea serviciilor SaaS, procesarea plăților, suport tehnic.</li>
                                <li><strong>Obligații legale (Art. 6(1)(c)):</strong> Păstrarea evidențelor financiar-contabile și fiscale conform legislației din România.</li>
                                <li><strong>Interes legitim (Art. 6(1)(f)):</strong> Asigurarea securității cibernetice a Platformei, prevenirea fraudelor, apărarea drepturilor noastre în justiție și îmbunătățirea serviciilor.</li>
                                <li><strong>Consimțământ (Art. 6(1)(a)):</strong> Comunicări de marketing (newsletter), doar cu acordul dvs. prealabil și explicit.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">3. Durata de Păstrare a Datelor</h3>
                            <p>Aplicăm principiul minimizării datelor. Datele de cont sunt păstrate pe durata existenței contului activ. După ștergerea contului, datele financiar-contabile vor fi păstrate timp de 10 ani (conform Legii Contabilității nr. 82/1991). Log-urile de securitate și acces sunt păstrate maxim 12 luni pentru investigarea potențialelor incidente de securitate.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">4. Destinatarii Datelor (Sub-procesatori)</h3>
                            <p>Pentru a oferi Platforma la standarde înalte, colaborăm cu furnizori de servicii de încredere, care acționează ca persoane împuternicite și sunt supuși unor Acorduri de Prelucrare a Datelor (DPA) stricte:</p>
                            <ul className="list-disc ml-5 space-y-1">
                                <li>Furnizori de hosting cloud și baze de date (ex: Google Cloud Platform, Firebase) - servere localizate exclusiv în UE (ex: Frankfurt, Belgia).</li>
                                <li>Procesatori de plăți (ex: Revolut) - certificați PCI-DSS.</li>
                                <li>Furnizori de servicii AI (ex: Google Gemini API) - datele trimise pentru procesare NU sunt utilizate pentru antrenarea modelelor AI publice, fiind aplicabile politicile Enterprise Privacy.</li>
                            </ul>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">5. Transferuri Internaționale de Date</h3>
                            <p>Datele dvs. sunt stocate și prelucrate în principal în Spațiul Economic European (SEE). În situația excepțională în care un sub-procesator transferă date în afara SEE (ex: SUA), ne asigurăm că transferul este fundamentat pe o decizie de adecvare a Comisiei Europene (ex: Data Privacy Framework) sau pe Clauze Contractuale Standard (SCC) aprobate, completate de măsuri de securitate suplimentare.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">6. Securitatea Datelor și Notificarea Încălcărilor (Breșe)</h3>
                            <p>Implementăm măsuri tehnice și organizatorice (TOMs) riguroase: criptare AES-256 în repaus, TLS 1.3 în tranzit, control strict al accesului bazat pe roluri (RBAC), monitorizare continuă a vulnerabilităților și backup-uri zilnice. În cazul improbabil al unei încălcări a securității datelor care prezintă un risc pentru drepturile dvs., vom notifica ANSPDCP în termen de maxim 72 de ore și, dacă riscul este ridicat, vă vom informa direct, conform Art. 33 și 34 din GDPR.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">7. Drepturile Dumneavoastră (Art. 15-22 GDPR)</h3>
                            <p>Beneficiați de următoarele drepturi garantate de lege: dreptul de acces la date, dreptul la rectificare, dreptul la ștergerea datelor ("dreptul de a fi uitat"), dreptul la restricționarea prelucrării, dreptul la portabilitatea datelor, dreptul la opoziție și dreptul de a nu face obiectul unei decizii bazate exclusiv pe prelucrarea automată (inclusiv crearea de profiluri).</p>
                            <p className="mt-2">Pentru exercitarea acestor drepturi sau pentru orice întrebări legate de protecția datelor, Responsabilul nostru cu Protecția Datelor (DPO) vă stă la dispoziție la: <strong>office@developly.pro</strong>. Termenul legal de răspuns este de 30 de zile.</p>
                            <p className="mt-2">Dacă considerați că prelucrarea datelor dvs. încalcă prevederile GDPR, aveți dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP - www.dataprotection.ro, adresa: B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, cod poștal 010336, București, România).</p>
                        </section>
                    </div>
                );
            case 'cookies':
                return (
                    <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6 flex items-start gap-3">
                           <Cookie className="text-orange-400 shrink-0 mt-1" />
                           <div>
                                <h4 className="font-bold text-white mb-1">Transparență Totală privind Cookie-urile și Tehnologiile de Urmărire</h4>
                                <p>Pentru a fi complet protejați în fața controalelor, aplicăm o politică strictă de transparență. Această politică explică detaliat utilizarea cookie-urilor pe Platforma GDPR Rapid, în conformitate cu Directiva ePrivacy (Directiva 2002/58/CE) și Regulamentul GDPR (UE 2016/679).</p>
                           </div>
                        </div>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">1. Ce sunt Cookie-urile și de ce le folosim?</h3>
                            <p>Cookie-urile sunt fișiere text de mici dimensiuni, formate din litere și numere, care sunt stocate pe browserul sau pe hard disk-ul dispozitivului dvs. (computer, smartphone, tabletă) la accesarea Platformei. Le folosim pentru a asigura funcționarea tehnică a site-ului, pentru a vă menține autentificat în siguranță și pentru a înțelege anonim cum este utilizată platforma, cu scopul de a o îmbunătăți.</p>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">2. Clasificarea Cookie-urilor Utilizate</h3>
                            <p className="mb-4">Cookie-urile pot fi de "sesiune" (se șterg automat când închideți browserul) sau "persistente" (rămân pe dispozitiv până la expirare sau ștergere manuală). De asemenea, ele pot fi "First-Party" (setate de noi) sau "Third-Party" (setate de partenerii noștri).</p>
                            
                            <div className="space-y-4 mt-2">
                                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                                    <h4 className="font-bold text-white flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-green-500"/> 
                                        A. Cookie-uri Strict Necesare (Esențiale)
                                    </h4>
                                    <p className="text-slate-400 mt-1">Aceste cookie-uri sunt vitale pentru funcționarea Platformei și nu pot fi dezactivate în sistemele noastre. Conform legii, nu necesită consimțământul dvs. prealabil, deoarece serviciul nu poate fi furnizat în absența lor.</p>
                                    <ul className="list-disc ml-5 mt-2 text-slate-400">
                                        <li><code>auth_session</code> (First-Party, Sesiune): Menține sesiunea dvs. activă și securizată după autentificare.</li>
                                        <li><code>csrf_token</code> (First-Party, Sesiune): Previne atacurile cibernetice de tip Cross-Site Request Forgery.</li>
                                        <li><code>cookie_consent</code> (First-Party, Persistent - 1 an): Reține opțiunile dvs. privind acceptarea cookie-urilor, pentru a nu vă întreba la fiecare vizită.</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-900 p-4 rounded border border-slate-700">
                                    <h4 className="font-bold text-white flex items-center gap-2">
                                        <Eye size={16} className="text-blue-500"/> 
                                        B. Cookie-uri de Performanță și Analitice
                                    </h4>
                                    <p className="text-slate-400 mt-1">Aceste cookie-uri ne permit să numărăm vizitele și sursele de trafic pentru a măsura și îmbunătăți performanța Platformei. Folosim soluții de analiză care <strong>anonimizează automat adresele IP</strong> înainte de stocare și nu partajează datele cu terți în scopuri publicitare sau de creare de profiluri (profiling).</p>
                                    <ul className="list-disc ml-5 mt-2 text-slate-400">
                                        <li><code>_ga</code> / <code>_gid</code> (Third-Party Google Analytics, Persistent): Utilizate pentru a distinge utilizatorii în mod anonim. Setate doar cu consimțământul dvs. (dacă este activat modulul de consent).</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                        <section>
                            <h3 className="text-lg font-bold text-white mb-2">3. Gestionarea și Ștergerea Cookie-urilor</h3>
                            <p>Aveți control total asupra cookie-urilor. Puteți retrage consimțământul pentru cookie-urile non-esențiale în orice moment din setările platformei. De asemenea, puteți seta browserul dvs. să blocheze sau să șteargă cookie-urile. Vă rugăm să rețineți că blocarea cookie-urilor strict necesare va face imposibilă autentificarea și utilizarea contului dvs. pe Platformă.</p>
                            <p className="mt-2 text-slate-400 italic">Pentru instrucțiuni specifice browserului dvs. (Chrome, Firefox, Safari, Edge), vă rugăm să consultați secțiunea "Ajutor" / "Setări de confidențialitate" a acestuia.</p>
                        </section>
                    </div>
                );
            default: return null;
        }
    }

    const getTitle = () => {
        switch(activeLegal) {
            case 'terms': return 'Termeni și Condiții de Utilizare';
            case 'privacy': return 'Politica de Confidențialitate';
            case 'cookies': return 'Politica de Cookies';
            default: return '';
        }
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setActiveLegal(null)}>
            <div className="bg-slate-900 w-full max-w-2xl max-h-[85vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 rounded-t-2xl sticky top-0">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        {activeLegal === 'privacy' ? <Lock className="text-blue-500"/> : activeLegal === 'cookies' ? <Cookie className="text-orange-500"/> : <FileText className="text-slate-400"/>}
                        {getTitle()}
                    </h2>
                    <button onClick={() => setActiveLegal(null)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {getContent()}
                </div>
                <div className="p-6 border-t border-slate-800 bg-slate-900 rounded-b-2xl text-right">
                    <button onClick={() => setActiveLegal(null)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                        Am înțeles
                    </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
      
      {/* Legal Modal Render */}
      <LegalModal />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-500 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <ShieldCheck className="h-8 w-8" />
            <span className="font-bold text-xl text-white">GDPR Rapid</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection('why-subscription')} className="hover:text-white transition-colors">De ce Abonament?</button>
            <button onClick={() => scrollToSection('demo')} className="hover:text-white transition-colors">Funcționalități</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">Prețuri</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors">Întrebări</button>
          </div>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <>
                <span className="text-xs text-slate-400 hidden lg:inline max-w-[150px] truncate">
                  Salut, {currentUser.email}
                </span>
                <button 
                  onClick={onLogout} 
                  className="text-slate-300 hover:text-red-400 font-medium text-sm transition-colors"
                >
                  Deconectare
                </button>
                <button 
                  onClick={onContinueOnboarding}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-900/50"
                >
                  Continuă Configurare
                </button>
              </>
            ) : (
              <>
                <button onClick={onLogin} className="text-slate-300 hover:text-white font-medium text-sm">
                  Intră în cont
                </button>
                <button 
                  onClick={onGetStarted}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-900/50"
                >
                  Începe Gratuit
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-medium mb-6">
            <Award size={14} />
            <span>Documentație Garantată Juridic conform Legii 190/2018</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Conformitate GDPR Completă.<br />Fără birocrație inutilă.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Singura platformă din România care generează, actualizează și garantează corectitudinea documentelor tale juridice în fața controalelor ANSPDCP.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser ? (
              <button 
                onClick={onContinueOnboarding}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2"
              >
                Continuă Configurare GDPR
                <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2"
              >
                Start Configurare
                <ArrowRight size={20} />
              </button>
            )}
            <button 
              onClick={onDemo}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-lg transition-all border border-slate-700 flex items-center justify-center gap-2 group"
            >
              Vezi Demo Live
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-slate-500 grayscale opacity-60">
             <span className="font-bold text-xl">SaaS Inc</span>
             <span className="font-bold text-xl">TechSoft</span>
             <span className="font-bold text-xl">ClinicaPRO</span>
             <span className="font-bold text-xl">ShopifyRO</span>
          </div>
        </div>
      </section>

      {/* NEW SECTION: DE CE ABONAMENT? (EDUCATIV) */}
      <section id="why-subscription" className="py-20 px-6 bg-slate-900/30 border-y border-slate-800 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">De ce un abonament lunar și nu un "dosar unic"?</h2>
                <p className="text-slate-400 text-lg">
                    Mulți antreprenori cred că GDPR se rezolvă "o singură dată". În realitate, autoritățile sancționează lipsa de actualizare, nu lipsa documentului inițial.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Partea Stângă: Mitul Dosarului Static */}
                <div className="space-y-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <h3 className="text-xl font-bold text-slate-400 flex items-center gap-2">
                        <XCircle className="text-red-500" />
                        Abordarea Veche (Riscantă)
                    </h3>
                    <div className="bg-slate-950 p-6 rounded-2xl border border-red-900/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <FileText size={100} />
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 text-slate-400">
                                <span className="text-red-500 font-bold">✗</span>
                                <div>
                                    <strong className="block text-slate-300">Documente Expirate</strong>
                                    Legislatia se schimbă (ex: AI Act, Legea 190). Un dosar din 2023 este nul astăzi.
                                </div>
                            </li>
                            <li className="flex gap-3 text-slate-400">
                                <span className="text-red-500 font-bold">✗</span>
                                <div>
                                    <strong className="block text-slate-300">Date Inexacte</strong>
                                    Ai schimbat firma de curierat sau contabilitatea? Dacă nu ai DPA nou, ești în culpă.
                                </div>
                            </li>
                            <li className="flex gap-3 text-slate-400">
                                <span className="text-red-500 font-bold">✗</span>
                                <div>
                                    <strong className="block text-slate-300">Zero Istoric (Audit Trail)</strong>
                                    La control, inspectorii cer dovada că ai gestionat incidentele, nu doar o foaie goală.
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Partea Dreaptă: Soluția SaaS */}
                <div className="space-y-6 relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20"></div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 relative z-10">
                        <CheckCircle2 className="text-green-500" />
                        Abordarea GDPR Rapid (Sigură)
                    </h3>
                    <div className="bg-slate-900 p-8 rounded-2xl border border-blue-500/50 relative z-10 shadow-2xl">
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="bg-blue-500/20 p-3 rounded-lg text-blue-400 h-fit">
                                    <Scale size={24} />
                                </div>
                                <div>
                                    <strong className="block text-white text-lg">Actualizare Legislativă Automată</strong>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Monitorizăm Monitorul Oficial. Când legea se schimbă, platforma îți actualizează documentele și te notifică.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="bg-purple-500/20 p-3 rounded-lg text-purple-400 h-fit">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <strong className="block text-white text-lg">Dinamica Afacerii</strong>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Angajezi oameni noi? Lansezi un site nou? Platforma generează instant actele adiționale necesare.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="bg-green-500/20 p-3 rounded-lg text-green-400 h-fit">
                                    <History size={24} />
                                </div>
                                <div>
                                    <strong className="block text-white text-lg">Pregătire de Control Instantă</strong>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Generezi oricând un "Raport de Conformitate" cu timestamp, care dovedește buna-credință în fața ANSPDCP.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Feature / Demo Section */}
      <section id="demo" className="py-20 bg-slate-900/50 border-y border-slate-800 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tot ce ai nevoie pentru liniștea ta</h2>
            <p className="text-slate-400">Platforma noastră acoperă toți cei 3 piloni ai conformității GDPR.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400 mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Generator Documente</h3>
              <p className="text-slate-400 leading-relaxed">
                De la Politica de Confidențialitate la contractele cu furnizorii (DPA). Totul generat automat pe baza profilului tău.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-400 mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Securitate & Registre</h3>
              <p className="text-slate-400 leading-relaxed">
                Ținem evidența breșelor de securitate și te ajutăm să implementezi măsuri tehnice (MFA, Backups) explicate simplu.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center text-green-400 mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Audit & Dovezi</h3>
              <p className="text-slate-400 leading-relaxed">
                Generezi un raport PDF complet cu un singur click, gata de prezentat autorităților în caz de control.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Added scroll-margin-top */}
      <section id="pricing" className="py-20 px-6 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Investiție minimă, protecție maximă</h2>
            <p className="text-slate-400">Costul unei amenzi GDPR începe de la 2.500 EUR. Costul liniștii tale începe de la 0 lei.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
                    onClick={onGetStarted}
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
      </section>

      {/* FAQ - Added scroll-margin-top */}
      <section id="faq" className="py-20 bg-slate-900/30 px-6 border-t border-slate-800 scroll-mt-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Întrebări Frecvente</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-medium text-slate-200">{faq.q}</span>
                  {openFaq === index ? <ChevronUp className="text-blue-500" /> : <ChevronDown className="text-slate-500" />}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4 prose prose-invert prose-sm max-w-none">
                    <Markdown components={{
                      a: ({node, ...props}) => <a {...props} className="text-blue-400 hover:text-blue-300 underline underline-offset-4" target="_blank" rel="noopener noreferrer" />
                    }}>
                      {faq.a}
                    </Markdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Fixed Links */}
      <footer className="py-12 border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-lg">GDPR Rapid</span>
            </div>
            <p className="mb-4">Soluția completă de conformitate pentru antreprenorii români.</p>
            <p>&copy; {new Date().getFullYear()} CATALIN MI SANDU PFA.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Produs</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('demo')} className="hover:text-blue-400 text-left">Caracteristici</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-blue-400 text-left">Prețuri</button></li>
              <li><button onClick={() => scrollToSection('why-subscription')} className="hover:text-blue-400 text-left">De ce Abonament?</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setActiveLegal('terms')} className="hover:text-blue-400 text-left">Termeni și condiții</button></li>
              <li><button onClick={() => setActiveLegal('privacy')} className="hover:text-blue-400 text-left">Politica de confidențialitate</button></li>
              <li><button onClick={() => setActiveLegal('cookies')} className="hover:text-blue-400 text-left">Politica Cookies</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li><a href="mailto:office@developly.pro" className="hover:text-blue-400">office@developly.pro</a></li>
              <li>+40 765 26 38 60</li>
              <li>Craiova, Strada Infratirii, Nr 15</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
