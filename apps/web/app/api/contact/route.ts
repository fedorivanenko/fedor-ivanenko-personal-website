import { checkBotId } from "botid/server";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384;

const inquirySchema = z.object({
  email: z.string().trim().email().max(254),
  message: z.string().trim().max(5000),
  company: z.string().max(100).optional(),
  submissionId: z.string().uuid(),
});

function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");

  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Request denied." }, { status: 403 });
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  }

  const verification = await checkBotId({
    advancedOptions: { checkLevel: "basic" },
  });

  if (verification.isBot) {
    return NextResponse.json({ error: "Request denied." }, { status: 403 });
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = inquirySchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Enter a valid email." },
      { status: 400 },
    );
  }

  if (result.data.company) {
    return NextResponse.json({ success: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    console.error("Contact email environment variables are not configured.");
    return NextResponse.json(
      { error: "Messaging is temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send(
      {
        from: fromEmail,
        to: [toEmail],
        replyTo: result.data.email,
        subject: "New project inquiry",
        text: `Sender: ${result.data.email}\n\n${result.data.message || "No project details provided."}`,
      },
      { idempotencyKey: `project-inquiry/${result.data.submissionId}` },
    );

    if (error) {
      console.error("Contact email delivery failed.", error);
      return NextResponse.json(
        { error: "Message could not be sent. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (deliveryError) {
    console.error("Contact email delivery failed.", deliveryError);
    return NextResponse.json(
      { error: "Message could not be sent. Please try again." },
      { status: 502 },
    );
  }
}
