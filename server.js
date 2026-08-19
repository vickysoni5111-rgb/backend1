require("dotenv").config();

const express = require("express");
const cors = require("cors");

const sendEnquiryEmail = require("./emailService");

const app = express();

// ======================================================
// CONFIG
// ======================================================

const PORT = process.env.PORT || 5000;

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://frontend1-five-red.vercel.app", // Live Vercel Frontend URL Added
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Backend is working",
    server: "Pawanputra Enquiry Server",
  });
});

// ======================================================
// ENQUIRY API
// ======================================================

app.post("/api/enquiry", async (req, res) => {
  try {
    console.log("\n======================================");
    console.log("📩 NEW PROJECT ENQUIRY RECEIVED");
    console.log("======================================");

    console.log(req.body);

    const {
      name,
      phone,
      email,
      company,
      service,
      message,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required.",
      });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email address is required.",
      });
    }

    // Basic email validation

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // ==================================================
    // SEND EMAIL
    // ==================================================

    console.log("📤 Sending enquiry email...");

    const mailResult = await sendEnquiryEmail({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      company: company?.trim() || "",
      service: service?.trim() || "",
      message: message?.trim() || "",
    });

    console.log("✅ EMAIL SENT SUCCESSFULLY");
    console.log("Message ID:", mailResult.messageId);

    // ==================================================
    // SUCCESS RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,
      message: "Enquiry sent successfully.",
      messageId: mailResult.messageId,
    });

  } catch (error) {

    console.error("\n======================================");
    console.error("❌ ENQUIRY EMAIL ERROR");
    console.error("======================================");

    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "We could not send your enquiry right now. Please try again.",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
});

// ======================================================
// 404 API
// ======================================================

app.use("/api", (req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((error, req, res, next) => {
  console.error("GLOBAL SERVER ERROR:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {
  console.log("");
  console.log("======================================");
  console.log("🔥 PAWANPUTRA BACKEND STARTED");
  console.log("======================================");
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(
    `❤️ Health: http://localhost:${PORT}/api/health`
  );
  console.log(
    `📧 Email To: ${process.env.EMAIL_TO || "Not configured"}`
  );
  console.log("======================================");
  console.log("");
});