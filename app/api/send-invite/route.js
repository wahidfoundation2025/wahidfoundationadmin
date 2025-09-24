import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Invite from "@/lib/models/invite";
import { dbConnect } from "@/lib/dbConnect";

import { corsHeaders } from "../../layout";

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("📥 Incoming Invite Payload:", JSON.stringify(body, null, 2));

    const { email, role, access } = body;

    if (!email || !role) {
      console.log("❌ Missing email or role");
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(access)) {
      console.log("❌ Access is not an array:", access);
      return NextResponse.json(
        { error: "Access must be an array" },
        { status: 422 }
      );
    }

    const existing = await Invite.findOne({ email });
    if (existing) {
      console.log("⚠️ Email already invited:", email);
      return NextResponse.json(
        { error: "Email already invited" },
        { status: 409 }
      );
    }

    const invite = await Invite.create({ email, role, access });
    console.log("✅ Invite saved to DB:", invite);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const result = await transporter.sendMail({
      from: '"Wahid Admin" <no-reply@wahid.org.in>',
      to: email,
      subject: "You are invited to WahidAdmin Dashboard",
      html: `
        <h2>You've been invited to WahidAdmin</h2>
        <p>You were invited to join the admin dashboard with role: <b>${role}</b></p>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/login">Click here to sign in</a> using your Google account</p>
      `,
    });

    console.log("📤 Email sent:", result.messageId);

    return NextResponse.json(
      { success: true, invite },
      { status: 201, headers: corsHeaders }
    );
  } catch (err) {
    console.error("❌ Invite Error:", err.message);
    console.error(err.stack);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
