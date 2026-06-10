import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { LegalModal } from './LegalModal';

interface AuthProps {
  onLogin: (acceptedTerms?: boolean) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  // Prefill email if saved from checkout page
  React.useEffect(() => {
    const prefillEmail = localStorage.getItem('payer_email_prefill');
    if (prefillEmail) {
      setEmail(prefillEmail);
      setIsLogin(false); // Since they just paid, they probably need to register a new account
      setAcceptedTerms(true); // Pre-agree to save time
      localStorage.removeItem('payer_email_prefill');
    }
  }, []);

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccessMsg(null);

      if (!email) {
          setError('Te rugăm să introduci adresa de email.');
          return;
      }

      setLoading(true);
      try {
          await sendPasswordResetEmail(auth, email);
          setSuccessMsg('Email-ul pentru resetarea parolei a fost trimis! Verifică și folderul Spam.');
          setTimeout(() => setIsForgotPassword(false), 5000);
      } catch (err: any) {
          console.error("Reset password error:", err);
          setError('A apărut o eroare. Verifică dacă adresa de email este corectă.');
      } finally {
          setLoading(false);
      }
  };

  const handleGoogleAuth = async () => {
      setError(null);
      if (!isLogin && !acceptedTerms) {
          setError('Trebuie să accepți termenii și condițiile pentru a continua.');
          return;
      }
      setLoading(true);
      try {
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          onLogin(!isLogin ? true : undefined);
      } catch (err: any) {
          console.error("Google auth error:", err);
          if (err.code === 'auth/popup-closed-by-user') {
              setError(null);
          } else if (err.code === 'auth/popup-blocked') {
              setError('Browserul a blocat fereastra de autentificare. Te rugăm să permiți pop-up-urile pentru acest site.');
          } else if (err.code === 'auth/unauthorized-domain') {
              setError('Acest domeniu nu este autorizat în consola Firebase. Te rugăm să adaugi domeniul curent la "Authorized Domains".');
          } else if (err.code === 'auth/operation-not-allowed') {
              setError('Autentificarea cu Google nu este activată în Firebase. Te rugăm să o activezi din consola Firebase.');
          } else {
              setError('Autentificarea cu Google a eșuat. Te rugăm să încerci din nou.');
          }
      } finally {
          setLoading(false);
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!isLogin && !acceptedTerms) {
        setError('Trebuie să accepți termenii și condițiile pentru a continua.');
        return;
    }
    
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        onLogin();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Trimitem email de confirmare, dar nu blocăm fluxul dacă eșuează
        try {
            await sendEmailVerification(userCredential.user);
        } catch (verifyErr) {
            console.error("Eroare la trimiterea emailului de verificare:", verifyErr);
        }
        onLogin(true);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Acest email este deja folosit. Încearcă să te autentifici.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Email sau parolă incorectă.');
      } else if (err.code === 'auth/weak-password') {
        setError('Parola trebuie să aibă cel puțin 6 caractere.');
      } else {
        setError('A apărut o eroare. Te rugăm să încerci din nou.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isForgotPassword) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md">
            <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Resetare Parolă</h2>
              <p className="text-slate-400 mb-6 text-sm">Introdu adresa de email asociată contului tău și îți vom trimite instrucțiunile de resetare.</p>
              
              {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
              {successMsg && <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded-lg text-sm mb-4">{successMsg}</div>}

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="contact@compania-ta.ro"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : 'Trimite Email'}
                </button>
              </form>
              <button 
                onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMsg(null); }}
                className="mt-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mx-auto"
              >
                <ArrowLeft size={16} /> Înapoi la autentificare
              </button>
            </div>
          </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center cursor-pointer" onClick={onBack}>
          <div className="inline-flex items-center gap-2 text-blue-500 mb-4">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Bine ai revenit!' : 'Creează cont nou'}
          </h2>
          <p className="text-slate-400">
            {isLogin ? 'Accesează documentele tale GDPR' : 'Începe drumul spre conformitate'}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="contact@compania-ta.ro"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-400">Parolă</label>
                  {isLogin && (
                      <button 
                          type="button" 
                          onClick={() => { setIsForgotPassword(true); setError(null); }}
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                      >
                          Ai uitat parola?
                      </button>
                  )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-slate-400 leading-relaxed">
                  Sunt de acord cu <button type="button" onClick={() => setLegalModalType('terms')} className="text-blue-400 hover:text-blue-300 underline transition-colors">Termenii și Condițiile</button> și <button type="button" onClick={() => setLegalModalType('privacy')} className="text-blue-400 hover:text-blue-300 underline transition-colors">Politica de Confidențialitate</button>.
                </label>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Autentificare' : 'Înregistrare'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-slate-400">SAU</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="mt-6 w-full bg-white hover:bg-gray-100 text-slate-900 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuă cu Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
              }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isLogin ? 'Nu ai cont? Înregistrează-te' : 'Ai deja cont? Autentifică-te'}
            </button>
          </div>
        </div>
      </div>

      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
    </div>
  );
};
