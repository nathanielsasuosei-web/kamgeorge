import { NextResponse } from "next/server";

export async function POST(request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Paystack is not configured. Set PAYSTACK_SECRET_KEY." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, amount, orderId, metadata } = body || {};
  const pesewas = Math.round(Number(amount) * 100);
  if (!email || !pesewas || pesewas < 100) {
    return NextResponse.json(
      { error: "A valid email and amount are required." },
      { status: 400 }
    );
  }

  const origin =
    request.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const payload = {
    email: String(email).trim().toLowerCase(),
    amount: pesewas,
    currency: "GHS",
    reference: orderId || undefined,
    callback_url: `${origin}/checkout/callback`,
    metadata: {
      ...(metadata || {}),
      orderId: orderId || undefined,
    },
  };

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.status) {
    return NextResponse.json(
      { error: data.message || "Could not start Paystack checkout." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    authorizationUrl: data.data.authorization_url,
    reference: data.data.reference,
    accessCode: data.data.access_code,
  });
}
