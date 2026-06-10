import axios from "axios";
import { CompanyProfile, DocType } from "../types";

export const generateDocumentContent = async (
  docType: DocType,
  profile: CompanyProfile,
  language: 'RO' | 'EN' = 'RO'
): Promise<string> => {
  try {
    const response = await axios.post('/api/gemini/generate-document', {
      docType,
      profile,
      language
    });
    return response.data.content;
  } catch (error: any) {
    console.error("Client Gemini Error:", error);
    return error.response?.data?.error || "Serviciul de redactare juridică întâmpină probleme. Reîncercați.";
  }
};

/**
 * ANALIZĂ DE COMPLIANCE ADAPTATĂ (Art. 4 & 5 Legea 190)
 */
export const getComplianceAdvice = async (profile: CompanyProfile): Promise<string> => {
    try {
        const response = await axios.post('/api/gemini/compliance-advice', { profile });
        return response.data.advice;
    } catch (e) {
        console.error("Client compliance advice error:", e);
        return "Audit indisponibil.";
    }
};

export const generateDPIAReport = async (profile: CompanyProfile): Promise<{risk: 'low'|'medium'|'high', details: string}> => {
    try {
        const response = await axios.post('/api/gemini/dpia-report', { profile });
        return response.data.report;
    } catch (e) {
        console.error("Client DPIA report error:", e);
        return { risk: 'medium', details: 'Analiză manuală necesară.' };
    }
};
