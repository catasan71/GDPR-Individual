
import { DocType, DocumentItem } from './types';

export const ALL_DOCUMENTS: DocumentItem[] = [
  {
    id: '1',
    type: DocType.REGISTRU_EVIDENTA,
    title: '1. Registrul de Evidență a Prelucrărilor',
    description: 'Obligatoriu conform Art. 30 GDPR pentru prelucrări neocazionale (majoritatea IMM).',
    isMandatory: true,
    status: 'missing',
    history: [],
  },
  {
    id: '2',
    type: DocType.NOTA_INFORMARE_ANGAJATI,
    title: '2. Notă de Informare Angajați',
    description: 'Informarea obligatorie a personalului privind datele HR (Art. 13 GDPR).',
    isMandatory: true,
    status: 'missing',
    history: [],
  },
  {
    id: '3',
    type: DocType.NDA_ANGAJATI,
    title: '3. Acord de Confidențialitate (NDA) Angajați',
    description: 'Măsură organizatorică obligatorie pentru asigurarea confidențialității (Art. 32).',
    isMandatory: true,
    status: 'missing',
    history: [],
  },
  {
    id: '4',
    type: DocType.POLITICA_SECURITATE,
    title: '4. Politici de Securitate (TOM)',
    description: 'Măsuri tehnice și organizatorice de protecție (Art. 32).',
    isMandatory: true,
    status: 'missing',
    history: [],
  },
  {
    id: '5',
    type: DocType.NOTA_INFORMARE_CLIENTI,
    title: '5. Notă de Informare Clienți / Privacy Policy',
    description: 'Documentul public obligatoriu pentru transparență (Art. 13).',
    isMandatory: true,
    status: 'missing',
    history: [],
  },
  {
    id: '6',
    type: DocType.ACORD_PRELUCRARE,
    title: '6. Acord Prelucrare Date (DPA) Furnizori',
    description: 'Obligatoriu pentru relația cu IT, Contabilitate, Cloud (Art. 28).',
    isMandatory: true,
    status: 'missing',
    history: [],
  },
  {
    id: '7',
    type: DocType.PROCEDURA_CERERI,
    title: '7. Procedura Soluționare Cereri',
    description: 'Cum răspundem la drepturile de acces, ștergere, etc. (Art. 15-22).',
    isMandatory: true,
    status: 'missing',
    history: [],
  },
  {
    id: '8',
    type: DocType.REGISTRU_BRESE,
    title: '8. Registrul Incidentelor de Securitate',
    description: 'Evidența breșelor și procedura de notificare 72h (Art. 33).',
    isMandatory: true,
    status: 'missing',
    history: [],
  },
  {
    id: '9',
    type: DocType.POLITICA_RETENTIE,
    title: '9. Politica de Retenție a Datelor',
    description: 'Termene de stocare conform legislației române (Arhive, Contabilitate).',
    isMandatory: true,
    status: 'missing',
    history: [],
  },
  {
    id: '10',
    type: DocType.ANALIZA_PROPORTIONALITATE,
    title: '10. Analiză Necesitate & Proporționalitate (Art. 5)',
    description: 'Obligatorie în RO pentru monitorizare video/GPS la locul de muncă.',
    isMandatory: false, // Devine obligatoriu dacă există CCTV/GPS
    status: 'missing',
    history: [],
  },
  {
    id: '11',
    type: DocType.POLITICA_COOKIES,
    title: '11. Politica de Cookies',
    description: 'Obligatorie dacă aveți website cu cookies non-esențiale.',
    isMandatory: false,
    status: 'missing',
    history: [],
  },
  {
    id: '12',
    type: DocType.FORMULAR_CONSIMTAMANT,
    title: '12. Formular Consimțământ Marketing',
    description: 'Pentru newsletter sau profilare comercială.',
    isMandatory: false,
    status: 'missing',
    history: [],
  },
  {
    id: '13',
    type: DocType.DPIA,
    title: '13. Evaluare Impact (DPIA)',
    description: 'Pentru riscuri ridicate (Art. 35) sau monitorizare sistematică.',
    isMandatory: false,
    status: 'missing',
    history: [],
  },
  {
    id: '14',
    type: DocType.DECIZIE_DPO,
    title: '14. Decizie Numire DPO',
    description: 'Obligatorie în RO dacă se procesează CNP pe interes legitim.',
    isMandatory: false,
    status: 'missing',
    history: [],
  },
  {
    id: '15',
    type: DocType.ANALIZA_INTERES,
    title: '15. Analiza Interesului Legitim (LIA)',
    description: 'Justificarea prelucrării fără consimțământ.',
    isMandatory: false,
    status: 'missing',
    history: [],
  }
];

export const INDUSTRIES = [
  'Comerț Online (eCommerce) - General',
  'Comerț Online - Produse Copii/Jucării',
  'Comerț Online - Farmacie/Suplimente',
  'Servicii Marketing & Publicitate',
  'Servicii Consultanță HR / Recrutare',
  'Servicii Contabilitate / Financiar',
  'Cabinet Medical Individual / Clinică Mică',
  'Stomatologie / Tehnică Dentară',
  'Horeca - Restaurant / Bar / Cafenea',
  'Horeca - Hotel / Pensiune',
  'Salon Înfrumusețare / SPA / Wellness',
  'Construcții & Amenajări',
  'Imobiliare (Agenție)',
  'IT & Software Development',
  'Service Auto / Reparații',
  'Transporturi / Logistică',
  'Educație / Training / Cursuri',
  'Săli de Sport / Fitness',
  'Asociații de Proprietari',
  'ONG / Asociații Non-Profit',
  'Altele'
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Starter',
    price: '0 lei',
    period: '/ lună',
    features: [
      'Checklist conformitate GDPR',
      'Generare max. 2 documente',
      'Dashboard basic',
      'Acces limitat la resurse'
    ],
    cta: 'Începe Gratuit',
    popular: false
  },
  {
    id: 'starter',
    name: 'Startup',
    price: '95 lei',
    period: '/ lună',
    features: [
      'Toate documentele obligatorii',
      'Actualizări legislative GARANTATE',
      'Export PDF & Word nelimitat',
      'Politica de Cookies inclusă',
      'Protecție juridică continuă'
    ],
    cta: 'Alege Startup',
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    price: '195 lei',
    period: '/ lună',
    features: [
      'Tot ce include Startup',
      'Suport prioritar dedicat',
      'Audit website automat',
      'Registru Breșe Securitate',
      'Analiză Risc (DPIA) cu AI',
      'Registru Semnături Angajați'
    ],
    cta: 'Alege Business',
    popular: false
  }
];

export const FAQS = [
  {
    q: "Sunt documentele valide în caz de control ANSPDCP?",
    a: "Absolut. Documentația generată respectă cu strictețe Legea 190/2018 și Regulamentul UE 679/2016. Spre deosebire de modelele generice 'copy-paste', algoritmii noștri redactează clauze specifice industriei tale (ex: Horeca, Medical, eCommerce), asigurând o acoperire juridică completă și corectă."
  },
  {
    q: "De ce este necesar un abonament lunar?",
    a: "GDPR este un proces continuu, nu un dosar static. Legislația se modifică periodic (ex: norme noi, decizii UE), iar dinamica firmei tale (angajați noi, softuri noi, parteneri noi) necesită actualizarea constantă a registrelor. Abonamentul îți garantează că documentația este mereu sincronizată cu realitatea curentă, eliminând riscul de a prezenta documente expirate la un control."
  },
  {
    q: "Ce garanție oferiți?",
    a: "Oferim garanția **'Zero Documente Expirate'**. Cea mai mare vulnerabilitate în fața controalelor este prezentarea unor acte vechi, neactualizate. Platforma noastră elimină tehnic acest risc prin monitorizare legislativă 24/7. În caz de control, vei prezenta întotdeauna documente cu timestamp recent, demonstrând autorităților 'Diligența Maximă' și buna-credință – cea mai puternică apărare juridică posibilă împotriva sancțiunilor."
  },
  {
    q: "Pot anula oricând?",
    a: "Da. Nu există perioadă contractuală minimă. Dacă anulezi, documentele deja generate și descărcate rămân ale tale, valide la data generării."
  },
  {
    q: "Unde pot verifica ghidul autorității competente de control GDPR?",
    a: "Puteți consulta ghidul autorității competente de control GDPR (ANSPDCP) accesând următorul link: [https://www.dataprotection.ro/servlet/ViewDocument?id=1425](https://www.dataprotection.ro/servlet/ViewDocument?id=1425)"
  }
];
