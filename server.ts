import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Resend } from "resend";
import axios from "axios";
import { 
  generateDocumentContentServer, 
  getComplianceAdviceServer, 
  generateDPIAReportServer 
} from "./services/geminiServer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Revolut Merchant API - Create Order link
  app.post("/api/revolut/create-order", async (req, res) => {
    try {
      const { planId, email } = req.body;
      const secretKey = process.env.REVOLUT_SECRET_KEY;

      if (!secretKey) {
        // Return not configured code so frontend can transparently fallback to manual Revolut transfer
        return res.json({ 
          code: "REVOLUT_NOT_CONFIGURED", 
          message: "Revolut API secret key has not been configured in the workspace settings." 
        });
      }

      // Determine price details
      let amount = 19500; // 195.00 RON by default (Premium / Business)
      let planName = "Premium";
      if (planId === "starter") {
        amount = 9500; // 95.00 RON
        planName = "Startup";
      } else if (planId === "business") {
        amount = 19500; // 195.00 RON
        planName = "Business";
      }

      const isSandbox = process.env.REVOLUT_IS_SANDBOX !== "false";
      const baseUrl = isSandbox 
        ? "https://sandbox-merchant.revolut.com/api/1.0" 
        : "https://merchant.revolut.com/api/1.0";

      const origin = req.headers.origin || req.headers.referer || "http://localhost:3000";

      const orderPayload = {
        amount,
        currency: "RON",
        description: `Abonament GDPR Rapid - ${planName}`,
        customer: email ? { email } : undefined,
        redirect_url: `${origin}/?payment=success`,
        metadata: {
          planId,
          email
        }
      };

      console.log("Requesting Revolut Order on endpoint:", `${baseUrl}/orders`, "with payload:", orderPayload);

      const response = await axios.post(`${baseUrl}/orders`, orderPayload, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          "Revolut-Api-Version": "2023-09-01"
        }
      });

      console.log("Successfully created Revolut Merchant Order:", response.data);

      res.json({
        success: true,
        orderId: response.data.id,
        checkoutUrl: response.data.checkout_url || response.data.checkout_url_alternative,
        publicId: response.data.public_id,
        state: response.data.state
      });
    } catch (error: any) {
      console.error("Revolut Order creation error details:", error.response?.data || error.message);
      res.status(500).json({ 
        error: error.response?.data?.description || error.response?.data?.message || error.message || "Failed to create Revolut Checkout Session" 
      });
    }
  });

  // Revolut Merchant API - Check Order status
  app.get("/api/revolut/order-status/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const secretKey = process.env.REVOLUT_SECRET_KEY;

      if (!secretKey) {
        return res.status(400).json({ error: "Revolut API secret key has not been configured." });
      }

      const isSandbox = process.env.REVOLUT_IS_SANDBOX !== "false";
      const baseUrl = isSandbox 
        ? "https://sandbox-merchant.revolut.com/api/1.0" 
        : "https://merchant.revolut.com/api/1.0";

      const response = await axios.get(`${baseUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Revolut-Api-Version": "2023-09-01"
        }
      });

      const state = response.data.state?.toLowerCase();
      res.json({
        id: response.data.id,
        state: response.data.state,
        completed: state === "completed" || state === "captured"
      });
    } catch (error: any) {
      console.error("Revolut check order status error:", error.response?.data || error.message);
      res.status(500).json({ error: error.message || "Failed to retrieve order status from Revolut" });
    }
  });

  // Gemini API Proxy Endpoints
  app.post("/api/gemini/generate-document", async (req, res) => {
    try {
      const { docType, profile, language } = req.body;
      const content = await generateDocumentContentServer(docType, profile, language);
      res.json({ content });
    } catch (error: any) {
      console.error("Gemini server-side error:", error);
      res.status(500).json({ error: error.message || "Failed to generate document content" });
    }
  });

  app.post("/api/gemini/compliance-advice", async (req, res) => {
    try {
      const { profile } = req.body;
      const advice = await getComplianceAdviceServer(profile);
      res.json({ advice });
    } catch (error: any) {
      console.error("Compliance advice server-side error:", error);
      res.status(500).json({ error: error.message || "Failed to get compliance advice" });
    }
  });

  app.post("/api/gemini/dpia-report", async (req, res) => {
    try {
      const { profile } = req.body;
      const report = await generateDPIAReportServer(profile);
      res.json({ report });
    } catch (error: any) {
      console.error("DPIA report server-side error:", error);
      res.status(500).json({ error: error.message || "Failed to generate DPIA report" });
    }
  });

  // Email API endpoint (Resend)
  app.post("/api/email/send", async (req, res) => {
    try {
      const { to, subject, html } = req.body;
      const apiKey = process.env.RESEND_API_KEY;
      
      if (!apiKey) {
        return res.status(400).json({ error: "Sistemul de email nu este configurat (lipsește RESEND_API_KEY)." });
      }

      const resend = new Resend(apiKey);
      
      const data = await resend.emails.send({
        from: "GDPR Rapid <onboarding@resend.dev>", // Domeniu de test Resend
        to: [to],
        subject: subject,
        html: html,
      });

      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Email API Error:", error.message);
      res.status(500).json({ error: "Eroare la trimiterea email-ului." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
