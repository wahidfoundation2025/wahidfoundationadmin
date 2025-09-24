import { dbConnect } from "../../../lib/dbConnect";
import Donation from "../../../lib/models/donation";
import Donor from "../../../lib/models/donor";
import nodemailer from "nodemailer";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";

import { corsHeaders } from "../../layout";

export const runtime = "nodejs";

// ---------- CORS ----------
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// ---------- GET ----------
export async function GET() {
  await dbConnect();
  const donations = await Donation.find().sort({ createdAt: -1 });
  return new Response(JSON.stringify(donations), {
    status: 200,
    headers: corsHeaders,
  });
}

// ---------- PDF Generator with custom font ----------
async function generatePdfBuffer(donation, donor) {
  const pdfDoc = await PDFDocument.create();

  // ✅ Register fontkit
  pdfDoc.registerFontkit(fontkit);

  // ✅ Load TTF font that supports ₹
  const fontPath = path.join(process.cwd(), "public", "Roboto-Regular.ttf");
  const fontBytes = fs.readFileSync(fontPath);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const page = pdfDoc.addPage([595.28, 841.89]);
  const { height } = page.getSize();
  let y = height - 50;

  function write(text, size = 12, gap = 10) {
    page.drawText(text, {
      x: 50,
      y: y,
      size,
      font: customFont,
      color: rgb(0, 0, 0),
    });
    y -= size + gap;
  }

  write("WAHID FOUNDATION", 20, 15);
  write("Registered Non-Profit Organization");
  write("80G Registration Number: AABCW1234F20214");
  y -= 20;
  write("TAX EXEMPTION CERTIFICATE", 18, 15);
  y -= 20;
  write(`Donor Name: ${donor.name}`);
  write(`Email: ${donor.email}`);
  write(`Address: ${donor.address || "N/A"}`);
  y -= 10;
  write(`Donation Amount: ₹${donation.amount}`);
  write(
    `Donation Date: ${new Date(donation.createdAt).toLocaleDateString("en-IN")}`
  );
  write(`Donation Type: ${donation.donationType}`);
  write(`Project: ${donation.projectName || "General Donation"}`);
  write(`Receipt Number: ${donation._id}`);
  y -= 20;
  write(
    "This donation qualifies for tax exemption under Section 80G of the Income Tax Act, 1961."
  );
  y -= 20;
  write("Authorized Signatory");
  write("Wahid Foundation");
  write(`Date: ${new Date().toLocaleDateString("en-IN")}`);
  write(
    "This is a computer-generated certificate and does not require a physical signature."
  );

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
// ---------- Email with Nodemailer ----------
async function sendEmailWithPdf(toEmail, pdfBuffer) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Wahid Foundation" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: "Donation Certificate",
    text: `Dear Donor,\n\nThank you for your generous donation. Please find your Donation Certificate attached.\n\nWarm regards,\nWahid Foundation`,
    attachments: [
      {
        filename: "donationcertificate.pdf",
        content: pdfBuffer,
      },
    ],
  });
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();

  // Save donation
  const donation = await Donation.create({
    name: data.name,
    email: data.email,
    amount: data.amount,
    donationType: data.donationType,
    donationFrequency: data.donationFrequency,
    paymentId: data.paymentId,
    projectId: data.projectId,
    projectName: data.projectName,
    address: data.address || "",
  });

  // Update donor
  let donor = await Donor.findOne({ email: data.email });
  if (donor) {
    donor.totalDonated += data.amount;
    donor.donations = donor.donations || [];
    if (
      !donor.donations.some((id) => id.toString() === donation._id.toString())
    ) {
      donor.donations.push(donation._id);
    }
    if (
      data.projectId &&
      (!donor.projectsDonatedTo ||
        !donor.projectsDonatedTo.includes(data.projectId))
    ) {
      donor.totalProjects += 1;
      donor.projectsDonatedTo = donor.projectsDonatedTo || [];
      donor.projectsDonatedTo.push(data.projectId);
    }
    await donor.save();
  } else {
    donor = await Donor.create({
      name: data.name,
      email: data.email,
      address: data.address || "",
      profilePicture: "",
      totalDonated: data.amount,
      totalProjects: data.projectId ? 1 : 0,
      projectsDonatedTo: data.projectId ? [data.projectId] : [],
      donations: [donation._id],
    });
  }

  // Generate PDF and send email
  try {
    const pdfBuffer = await generatePdfBuffer(donation, donor);
    await sendEmailWithPdf(donor.email, pdfBuffer);
    console.log("✅ PDF emailed successfully.");
  } catch (err) {
    console.error("❌ Error sending PDF email:", err);
  }

  return new Response(JSON.stringify(donation), {
    status: 201,
    headers: corsHeaders,
  });
}
