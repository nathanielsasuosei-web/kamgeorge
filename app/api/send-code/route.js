import nodemailer from "nodemailer";

// POST { email, code, purpose } → sends the verification email.
// Requires EMAIL_USER + EMAIL_PASS env vars (see .env.example).
// Without them it returns { sent: false, demo: true } and the client
// falls back to the on-screen demo code.

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const email = (body?.email || "").trim().toLowerCase();
  const code = (body?.code || "").trim();
  if (!/.+@.+\..+/.test(email))
    return Response.json(
      { ok: false, error: "Invalid email." },
      { status: 400 }
    );
  if (!/^\d{6}$/.test(code))
    return Response.json(
      { ok: false, error: "Invalid code." },
      { status: 400 }
    );

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    return Response.json({ ok: true, sent: false, demo: true });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"KamGeorge" <${user}>`,
      to: email,
      subject: `Your KamGeorge verification code: ${code}`,
      text: `Your KamGeorge verification code is ${code}. It expires in 5 minutes. If you didn't request it, ignore this email.`,
      html: `<div style="font-family:sans-serif;max-width:480px"><h2>Your verification code</h2><p>Enter this code to verify your email:</p><p style="font-size:32px;font-weight:bold;letter-spacing:6px">${code}</p><p style="color:#666">It expires in 5 minutes. If you didn't request it, ignore this email.</p></div>`,
    });
    return Response.json({ ok: true, sent: true });
  } catch (err) {
    console.error("send-code failed:", err?.message || err);
    return Response.json(
      { ok: false, error: "Could not send the email. Try again." },
      { status: 500 }
    );
  }
}
