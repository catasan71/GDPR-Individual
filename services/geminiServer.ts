import { GoogleGenAI } from "@google/genai";
import { CompanyProfile, DocType } from "../types";

// Safe, server-side lazy initialization of the GoogleGenAI client
let aiInstance: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY / API_KEY has not been set in the server environment variables.");
    }
    aiInstance = new GoogleGenAI({ 
      apiKey: apiKey || "STANDBY_NO_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
};

/**
 * Robust content generation wrapper with exponential backoff and model fallbacks.
 * Catches 503 "High Demand" or "Temporary Spikes" errors and gracefully retries or uses fallback models.
 */
async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    model: string;
    contents: any;
    config?: any;
  }
): Promise<any> {
  const modelsToTry = [
    params.model,
    "gemini-3.5-flash",
    "gemini-3.1-pro-preview"
  ];

  // De-duplicate while preserving order
  const models = Array.from(new Set(modelsToTry.filter(Boolean)));
  let lastError: any = null;

  for (const modelName of models) {
    const maxRetries = 3;
    let delay = 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini API] Requesting ${modelName} (Attempt ${attempt}/${maxRetries})...`);
        const response = await ai.models.generateContent({
          ...params,
          model: modelName,
        });
        if (response) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        const errMessage = err.message || JSON.stringify(err);
        const errStatus = err.status || err.response?.status;
        console.warn(`[Gemini API] Attempt ${attempt} on model ${modelName} failed. Status: ${errStatus}, Error: ${errMessage}`);

        // If it's a 401 (Authentication) or 400 (Bad Request), do not retry (it is a configuration issue)
        if (errStatus === 401 || errStatus === 400 || errMessage.includes("apiKey") || errMessage.includes("API key")) {
          break; // Try next model or fail
        }

        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        }
      }
    }
  }

  throw lastError || new Error("S-au epuizat toate încercările de generare prin Gemini API.");
}

/**
 * LOGICA DE EXPERTIZĂ PE INDUSTRIE
 * Injectează riscurile specifice și legislația conexă din România.
 */
const getIndustrySpecifics = (industry: string): string => {
  const specifics: Record<string, string> = {
    'Comerț Online (eCommerce) - General': 'RISC: Profilare clienți și abandon coș. TEMEI: Art. 6(1)(b) pentru livrare, Art. 6(1)(a) pentru marketing (consmițământ distinct). LEGE: Ordonanța 34/2014 (comercial) + GDPR.',
    'Cabinet Medical Individual / Clinică Mică': 'CRITIC: Date sensibile Art. 9. TEMEI: Art. 9(2)(h) - asistență medicală. OBLIGAȚIE: Secret profesional (Legea 46/2003). Registru special de evidență a datelor de sănătate.',
    'Horeca - Restaurant / Bar / Cafenea': 'CCTV: Legea 333/2003 (paza bunurilor) vs GDPR. TEMEI: Interes Legitim (Art 6(1)(f)). NOTĂ: Analiza de proporționalitate obligatorie pentru filmarea spațiilor comune.',
    'IT & Software Development': 'ROL: Împuternicit (Processor) pentru clienți. OBLIGAȚIE: Art. 28 GDPR (Contract DPA). RISC: Acces la date de producție, medii de testare anonimizate.',
    'Transporturi / Logistică': 'MONITORIZARE: GPS pe mașini (Date de locație = Date Personale). LEGE 190/2018 Art. 5: Consultare sindicat/reprezentanți + informare prealabilă explicită.',
    'Săli de Sport / Fitness': 'BIOMETRIE: Acces cu amprentă (Art. 9). INTERDICȚIE: Nu se prelucrează date biometrice fără alternativă non-biometrică (card/cod).'
  };
  return specifics[industry] || 'STANDARD: Prelucrare date angajați, clienți, furnizori conform GDPR.';
};

/**
 * BLUEPRINTS DE STRUCTURĂ JURIDICĂ (Nivel "Profesor")
 * Aceasta forțează AI-ul să respecte structura obligatorie cerută de ANSPDCP.
 */
const getDocTypeSpecifics = (docType: DocType): string => {
    switch (docType) {
        case DocType.REGISTRU_EVIDENTA:
            return `
            STRUCTURA OBLIGATORIE (Art. 30 GDPR):
            1. Prezentare: Pentru fiecare activitate de prelucrare (ex: Facturare, HR, Marketing), creează o secțiune separată.
            2. Format: NU folosi tabele mari și aglomerate. Folosește o listă cu puncte pentru fiecare activitate:
               - **Activitate:** [Nume]
               - **Scop:** [Detalii]
               - **Persoane Vizate:** [Detalii]
               - **Categorii Date:** [Detalii]
               - **Temei Legal:** [Detalii]
               - **Destinatari:** [Detalii]
               - **Termen de stocare:** [Detalii]
               - **Măsuri de Securitate:** [Detalii]
            3. Legendă privind categoriile de date.
            4. Clauză de revizuire periodică.
            IMPORTANT: Generează MINIM 5 activități de prelucrare specifice industriei.`;

        case DocType.NOTA_INFORMARE_ANGAJATI:
            return `
            STRUCTURA OBLIGATORIE (Art. 13 GDPR & Legea 190/2018):
            1. Identitate Operator (Firma). 2. Scopuri (Executare CIM, SSM, Salarizare, Audit). 
            3. Temei Legal (Art. 6.1.b, 6.1.c, 6.1.f).
            4. MONITORIZARE (Dacă există CCTV/GPS): Detaliază conform Art. 5 din Legea 190/2018 (motivare, consultare, durată stocare 30 zile).
            5. Drepturile Angajatului: Acces, Rectificare, Ștergere, Opoziție, Dreptul de a nu fi supus unei decizii automate.`;

        case DocType.ACORD_PRELUCRARE:
            return `
            STRUCTURA OBLIGATORIE (DPA - Art. 28 GDPR):
            1. Obiectul și durata prelucrării. 2. Natura și scopul. 3. Obligațiile Împuternicitului (Esențial):
               - Instrucțiuni documentate ale Operatorului. - Confidențialitate personal. - Securitate (Art. 32).
               - Sub-procesatori: Clauză de aprobare prealabilă. - Asistență pentru drepturile persoanelor vizate.
               - Ștergere/Returnare date la finalul contractului. - Dreptul de Audit.`;

        case DocType.ANALIZA_PROPORTIONALITATE:
            return `
            STRUCTURA OBLIGATORIE (LIA/DPIA Hybrid pentru RO):
            1. Descrierea prelucrării (ex: CCTV). 2. Testul Necesității (De ce nu se poate altfel?).
            3. Testul Proporționalității (Echilibru drepturi angajat vs interes firmă).
            4. Garanții suplimentare (Cine vede imaginile? Cine are cheia de la DVR?).
            5. Concluzie legală semnată de Administrator.`;

        case DocType.NDA_ANGAJATI:
            return `
            STRUCTURA OBLIGATORIE:
            1. Definiția Datelor cu Caracter Personal. 2. Obligația de secret profesional (Art. 32.4).
            3. Interdicția copierii/instrainării datelor pe medii personale (Cloud personal, USB).
            4. Răspunderea disciplinară și patrimoniale conform Codului Muncii și GDPR.`;

        case DocType.POLITICA_SECURITATE:
            return `
            STRUCTURA OBLIGATORIE (TOMs - Art. 32):
            1. Măsuri Fizice (Dulapuri încuiate, acces sediu).
            2. Măsuri Tehnice (MFA obligatoriu, Criptare laptopuri, Backup extern, Antivirus).
            3. Măsuri Organizatorice (Instruire semestrială, Procedura 'Clean Desk', Revizuire drepturi acces).`;

        default:
            return "Structură profesională conform normelor ANSPDCP din România.";
    }
}

export const generateDocumentContentServer = async (
  docType: DocType,
  profile: CompanyProfile,
  language: 'RO' | 'EN' = 'RO'
): Promise<string> => {
  const model = "gemini-3.5-flash";
  const industryContext = getIndustrySpecifics(profile.industry);
  const docSpecifics = getDocTypeSpecifics(docType);
  
  const systemInstruction = `
    ROL: Ești un DPO (Data Protection Officer) și Avocat de Top din România (Ex-Big4 Audit).
    PERSONALITATE: Ești sever, precis, academic dar practic. Nu folosești cuvinte de umplutură.
    REDIJARE: 
    - FĂRĂ disclaimere de tip "Eu sunt un AI".
    - FĂRĂ introduceri de tip "Iată documentul tău".
    - DOAR conținutul juridic final, gata de imprimat.
    - FORMATARE: Documentul trebuie să fie aerisit, curat, fără simboluri decorative (fără #, *, #, etc.). Folosește spații albe generoase între secțiuni.
    - TABELE: Evită tabelele. Folosește liste cu puncte (bullet points) pentru date complexe.
    - CITEAZĂ: Regulamentul (UE) 2016/679 și Legea 190/2018 în fiecare secțiune relevantă.
    - LIMBA: ${language === 'EN' ? 'Engleză' : 'Română'}.
  `;

  const prompt = `
    GENEREAZĂ DOCUMENTUL JURIDIC: ${docType.toUpperCase()}
    
    DATE OPERATOR (CLIENT):
    - Denumire: ${profile.name}
    - CUI: ${profile.cui}
    - Industrie: ${profile.industry}
    - Website: ${profile.hasWebsite ? profile.websiteUrl : 'Nu are'}
    - Terți (Procesatori): ${profile.thirdPartyServices.join(', ')}

    CERINȚE DE STRUCTURĂ (BLUEPRINT):
    ${docSpecifics}

    INSTRUCȚIUNI FINALE:
    - Documentul trebuie să fie o LECȚIE DE COMPLIANCE.
    - Include secțiuni de semnături pentru Administrator și/sau Angajați.
    - MINIMIZEAZĂ numărul de câmpuri de completat. Completează automat tot ce poți pe baza datelor furnizate.
    - Unde datele absolut necesare nu sunt cunoscute, folosește placeholdere descriptive: [COMPLETAȚI: Descriere câmp].
    - FORMATARE STRICTĂ: NU folosi simboluri precum #, *, #. Folosește doar text simplu, paragrafe și liste.
  `;

  try {
    const ai = getAi();
    const response = await generateContentWithRetry(ai, {
      model,
      contents: prompt,
      config: { 
        systemInstruction, 
        temperature: 0.1, // Stabilitate maximă a output-ului
      }
    });

    return response.text || "Eroare la generarea conținutului juridic.";
  } catch (error: any) {
    console.error("Gemini Critical Error:", error);
    let errorDetails = error.message || JSON.stringify(error);
    if (errorDetails.includes("503") || errorDetails.includes("demand") || errorDetails.includes("UNAVAILABLE")) {
      errorDetails = "Toate variantele modelului de AI sunt temporar suprasolicitate în Google Cloud de alte aplicații global. Vă rugăm frumos să reîncercați peste câteva secunde.";
    }
    return `Serviciul de redactare juridică întâmpină erori sau cheia API nu este configurată corect. Detalii: ${errorDetails}`;
  }
};

/**
 * ANALIZĂ DE COMPLIANCE ADAPTATĂ (Art. 4 & 5 Legea 190)
 */
export const getComplianceAdviceServer = async (profile: CompanyProfile): Promise<string> => {
    const model = "gemini-3.5-flash";
    const prompt = `
        Ești un Auditor Senior. Analizează profilul: ${profile.industry}, ${profile.employeeCount} angajați, CCTV: ${profile.hasCCTV}, CNP Legitim: ${profile.processCNPLegitimateInterest}.
        Oferă 3 măsuri de conformitate CRITICE pentru România (Legea 190/2018). 
        Fii direct: "Faceți asta: [Măsură] pentru că [Articol Lege]".
    `;
    try {
        const ai = getAi();
        const response = await generateContentWithRetry(ai, { model, contents: prompt });
        return response.text || "";
    } catch (e: any) {
        console.error("Compliance advice server error:", e);
        return "Audit indisponibil pe server momentan.";
    }
};

export const generateDPIAReportServer = async (profile: CompanyProfile): Promise<{risk: 'low'|'medium'|'high', details: string}> => {
    const model = "gemini-3.5-flash";
    const prompt = `
        Analizează riscul DPIA conform listei ANSPDCP pentru:
        - Industrie: ${profile.industry}
        - Date Sensibile: ${profile.processSensitiveData}
        - Monitorizare Sistematică (CCTV): ${profile.hasCCTV}
        - Prelucrare CNP (Art 4 RO): ${profile.processCNPLegitimateInterest}
        
        Răspunde JSON: { "risk": "low|medium|high", "details": "explicație juridică scurtă" }
    `;
    try {
        const ai = getAi();
        const response = await generateContentWithRetry(ai, { 
            model, 
            contents: prompt, 
            config: { responseMimeType: 'application/json' } 
        });
        return JSON.parse(response.text || '{}');
    } catch (e: any) {
        console.error("DPIA Report server error:", e);
        return { risk: 'medium', details: 'Analiză manuală necesară.' };
    }
};
