import { NextResponse } from "next/server";
import { getPublishedSite } from "@/lib/published";

export const dynamic = "force-dynamic";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { name, email, message, honeypot } = body as {
      name?: unknown;
      email?: unknown;
      message?: unknown;
      honeypot?: unknown;
    };

    // Bot detection: silent success if honeypot is filled
    if (honeypot && String(honeypot).trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedMessage = typeof message === "string" ? message.trim() : "";

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address so I can get back to you." },
        { status: 400 }
      );
    }

    if (!trimmedMessage || trimmedMessage.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please write a message before sending." },
        { status: 400 }
      );
    }

    if (trimmedMessage.length > 3000) {
      return NextResponse.json(
        { ok: false, error: "Message is too long (maximum 3,000 characters)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    if (!apiKey) {
      console.warn("RESEND_API_KEY is not set in environment variables.");
      return NextResponse.json(
        {
          ok: false,
          error: "Email delivery is not yet configured. Please copy the email address or reach out via LinkedIn directly.",
        },
        { status: 503 }
      );
    }

    // Determine recipient email:
    // 1. Explicit env variable CONTACT_TO_EMAIL
    // 2. Published site's contact email
    // 3. First owner email from NEXT_PUBLIC_OWNER_EMAILS
    let toEmail = process.env.CONTACT_TO_EMAIL?.trim();
    if (!toEmail) {
      try {
        const site = await getPublishedSite();
        if (site.content?.contact?.email) {
          toEmail = site.content.contact.email.trim();
        }
      } catch {
        // Fallback to env
      }
    }
    if (!toEmail) {
      const ownerEmails = (process.env.NEXT_PUBLIC_OWNER_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      if (ownerEmails.length > 0) {
        toEmail = ownerEmails[0];
      }
    }
    if (!toEmail) {
      toEmail = "nnavaneeth2@gmail.com";
    }

    // Resend from address. By default Resend provides 'onboarding@resend.dev' for sandbox accounts.
    // If a custom domain is verified in Resend, RESEND_FROM_EMAIL can be set (e.g. 'hello@yourdomain.com').
    const fromEmail =
      process.env.RESEND_FROM_EMAIL?.trim() ||
      "Portfolio Contact <onboarding@resend.dev>";

    const displayName = trimmedName || "A site visitor";
    const subject = `Portfolio Message from ${displayName}`;
    const formattedDate = new Date().toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const safeName = escapeHtml(displayName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeMessage = escapeHtml(trimmedMessage);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #f7f6f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f1f1f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #e8e6df; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
    <tr>
      <td style="padding: 28px 28px 20px 28px; background: linear-gradient(180deg, #faf9f6 0%, #ffffff 100%); border-bottom: 1px solid #eee;">
        <span style="display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #78756e; background-color: #eceae3; padding: 4px 10px; border-radius: 999px;">
          New Portfolio Message
        </span>
        <h1 style="margin: 12px 0 0 0; font-size: 24px; font-weight: 700; color: #111111; line-height: 1.2;">
          ${safeName}
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #78756e; width: 70px; font-weight: 500;">Email:</td>
            <td style="padding: 6px 0; font-weight: 600;">
              <a href="mailto:${safeEmail}" style="color: #111111; text-decoration: underline;">${safeEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #78756e; font-weight: 500;">Date:</td>
            <td style="padding: 6px 0; color: #444444;">${formattedDate}</td>
          </tr>
        </table>

        <div style="background-color: #faf9f6; border: 1px solid #e8e6df; border-radius: 14px; padding: 20px; font-size: 15px; line-height: 1.65; color: #222222; white-space: pre-wrap; word-break: break-word;">
${safeMessage}
        </div>

        <div style="margin-top: 28px; text-align: center;">
          <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display: inline-block; background-color: #111111; color: #ffffff; padding: 13px 28px; border-radius: 999px; font-size: 14px; font-weight: 600; text-decoration: none; box-shadow: 0 2px 8px rgba(0,0,0,0.12);">
            Reply to ${safeName}
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 16px 28px; background-color: #faf9f6; border-top: 1px solid #eee; text-align: center; font-size: 12px; color: #8e8b82;">
        Received from your portfolio website contact form.
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const plainText = [
      `New portfolio message from: ${displayName}`,
      `Email: ${trimmedEmail}`,
      `Date: ${formattedDate}`,
      "",
      "Message:",
      trimmedMessage,
      "",
      `Reply to: ${trimmedEmail}`,
    ].join("\n");

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: trimmedEmail,
        subject,
        html,
        text: plainText,
      }),
    });

    const resendData = await resendRes.json().catch(() => null);

    if (!resendRes.ok) {
      console.error("Resend API response error:", resendRes.status, resendData);
      const resendMsg =
        (resendData && typeof resendData === "object" && "message" in resendData && typeof resendData.message === "string")
          ? resendData.message
          : "Failed to deliver email through Resend.";
      return NextResponse.json(
        { ok: false, error: resendMsg },
        { status: resendRes.status >= 400 && resendRes.status < 500 ? 400 : 502 }
      );
    }

    return NextResponse.json({ ok: true, id: resendData?.id });
  } catch (err) {
    console.error("Error in contact route handler:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your message. Please try again." },
      { status: 500 }
    );
  }
}
