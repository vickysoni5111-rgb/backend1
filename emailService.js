const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const escapeHtml = (value = "") => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sendEnquiryEmail = async ({
  name,
  phone,
  email,
  company,
  service,
  message,
}) => {
  const now = new Date();

  const enquiryDate = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(now);

  const enquiryTime = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  const safeName = escapeHtml(name);
  const safePhone = escapeHtml(phone);
  const safeEmail = escapeHtml(email);
  const safeCompany = escapeHtml(company || "Not Provided");
  const safeService = escapeHtml(service || "Not Selected");
  const safeMessage = escapeHtml(
    message || "No project details provided."
  );

  const mailOptions = {
    from: `"Pawanputra Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    replyTo: email,
    subject: `New Enquiry from ${email} - Pawanputra Enterprises`,
    html: `
      <div style="margin:0;padding:30px;background:#f3f1e8;font-family:Arial,Helvetica,sans-serif;">
        <div style="max-width:700px;margin:0 auto;background:#ffffff;border:1px solid #e5e0d4;border-radius:18px;overflow:hidden;">
          <div style="padding:30px;background:#11110f;border-bottom:5px solid #d6a82e;">
            <div style="color:#d6a82e;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;">
              PAWANPUTRA ENTERPRISES
            </div>
            <h1 style="margin:10px 0 0;color:#ffffff;font-size:28px;">
              New Project Enquiry
            </h1>
            <p style="margin:8px 0 0;color:#a8a8a8;font-size:14px;">
              A new enquiry has been received from your website.
            </p>
          </div>
          <div style="padding:24px 30px;">
            <div style="padding:18px;background:#fff8dc;border-left:5px solid #d6a82e;border-radius:10px;">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#8c6b12;">
                Enquiry Received From
              </div>
              <div style="margin-top:7px;font-size:20px;font-weight:800;color:#11110f;">
                ${safeEmail}
              </div>
            </div>
            <div style="display:flex;gap:12px;margin-top:18px;">
              <div style="flex:1;padding:14px;border:1px solid #ebe7dc;border-radius:10px;background:#faf9f4;">
                <div style="font-size:10px;font-weight:800;color:#999;text-transform:uppercase;letter-spacing:1px;">
                  Date
                </div>
                <div style="margin-top:6px;font-size:14px;font-weight:700;color:#11110f;">
                  ${enquiryDate}
                </div>
              </div>
              <div style="flex:1;padding:14px;border:1px solid #ebe7dc;border-radius:10px;background:#faf9f4;">
                <div style="font-size:10px;font-weight:800;color:#999;text-transform:uppercase;letter-spacing:1px;">
                  Time
                </div>
                <div style="margin-top:6px;font-size:14px;font-weight:700;color:#11110f;">
                  ${enquiryTime}
                </div>
              </div>
            </div>
            <h2 style="margin:28px 0 14px;color:#11110f;font-size:18px;">
              Customer Details
            </h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:11px;border-bottom:1px solid #eeeeee;font-size:12px;font-weight:700;color:#777;">Name</td>
                <td style="padding:11px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:700;color:#111;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:11px;border-bottom:1px solid #eeeeee;font-size:12px;font-weight:700;color:#777;">Phone</td>
                <td style="padding:11px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:700;color:#111;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding:11px;border-bottom:1px solid #eeeeee;font-size:12px;font-weight:700;color:#777;">Email</td>
                <td style="padding:11px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:700;color:#111;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding:11px;border-bottom:1px solid #eeeeee;font-size:12px;font-weight:700;color:#777;">Company</td>
                <td style="padding:11px;border-bottom:1px solid #eeeeee;font-size:13px;font-weight:700;color:#111;">${safeCompany}</td>
              </tr>
              <tr>
                <td style="padding:11px;font-size:12px;font-weight:700;color:#777;">Service</td>
                <td style="padding:11px;font-size:13px;font-weight:700;color:#111;">${safeService}</td>
              </tr>
            </table>
            <h2 style="margin:28px 0 14px;color:#11110f;font-size:18px;">
              Project Details
            </h2>
            <div style="padding:16px;background:#faf9f4;border-left:4px solid #d6a82e;border-radius:8px;color:#555;font-size:13px;line-height:1.8;white-space:pre-wrap;">
              ${safeMessage}
            </div>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEnquiryEmail;