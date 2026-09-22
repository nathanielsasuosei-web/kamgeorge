import { NextResponse } from "next/server";

export async function GET(request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Paystack is not configured." },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.status) {
    return NextResponse.json(
      { error: data.message || "Verification failed." },
      { status: 502 }
    );
  }

  const tx = data.data;
  return NextResponse.json({
    status: tx.status,
    reference: tx.reference,
    amount: tx.amount,
    paidAt: tx.paid_at,
    channel: tx.channel,
    customer: tx.customer,
    metadata: tx.metadata,
  });
}
