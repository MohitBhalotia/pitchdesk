import "dotenv/config";
import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
} from "@getbrevo/brevo";
import dbConnect from "../src/lib/db";
import UserModel from "../src/models/UserModel";

// ─────────────────────────────────────────────────────────────
// CONFIG — update these before running
// ─────────────────────────────────────────────────────────────
const SUBJECT = "Your AI Crew Is Ready — 100 Founding Spots Available";
const SENDER = { email: "info@pitchdesk.in", name: "Pitch Desk" };
const TEST_EMAILS = [
  { email: "nareshmahiya2017@gmail.com", fullName: "Naresh" },
  { email: "bt23csa053@iiitn.ac.in", fullName: "Co-founder" },
  { email: "bt23cse181@iiitn.ac.in", fullName: "Co-founder" },
  { email: "bt23cse025@iiitn.ac.in", fullName: "Co-founder" },
];
const BATCH_SIZE = 99; // Brevo messageVersions max per API call
// ─────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes("--dry-run");
const TEST_MODE = process.argv.includes("--test");

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Your AI Crew Is Ready — 100 Founding Spots Available</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Archivo+Black&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background-color: #EFE7D6; font-family: 'Space Grotesk', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  @media (max-width: 620px) {
    .main-table { width: 100% !important; }
    .two-col td.agent-card { display: block !important; width: 100% !important; margin-bottom: 14px !important; }
    .two-col td.spacer-col { display: none !important; }
    .offer-col td.perk-card { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
    .offer-col td.spacer-col { display: none !important; }
    .hero-pad { padding: 32px 22px !important; }
    .close-pad { padding: 36px 22px !important; }
    h1.hero-h { font-size: 30px !important; }
    h2.section-h { font-size: 24px !important; }
    h2.close-h { font-size: 22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#EFE7D6;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EFE7D6;padding:40px 16px;">
<tr><td align="center">

<table class="main-table" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

  <!-- LOGO -->
  <tr>
    <td style="padding:0 0 28px 0;text-align:center;">
      <img src="https://veqiro.com/logo.png" alt="Veqiro" width="130" style="display:block;margin:0 auto;" />
    </td>
  </tr>

  <!-- HERO BLOCK -->
  <tr>
    <td class="hero-pad" style="background-color:#111111;border:2px solid #111111;border-radius:10px;padding:52px 44px;text-align:center;box-shadow:6px 6px 0 #F5C518;">
      <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#F5C518;margin:0 0 20px 0;">FOUNDING MEMBER INVITE</p>
      <h1 class="hero-h" style="font-family:'Archivo Black',Arial,sans-serif;font-size:42px;font-weight:900;color:#EFE7D6;margin:0 0 18px 0;line-height:1.1;">
        Meet Your New<br/>AI Crew.
      </h1>
      <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:15px;color:#EFE7D6;opacity:0.6;margin:0 0 20px 0;line-height:1.75;">
        Veqiro gives lean startups a full-stack team, no headcount needed.<br/>We're launching soon, and we're keeping the first 100 spots for founders who show up early.
      </p>
      <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:17px;color:#EFE7D6;opacity:0.75;margin:0 0 36px 0;line-height:1.65;">
        6 AI employees. Real personalities. Real work.
      </p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 18px auto;">
        <tr>
          <td style="background-color:#F5C518;border:2px solid #EFE7D6;border-radius:7px;padding:16px 44px;box-shadow:4px 4px 0 #EFE7D6;">
            <a href="https://veqiro.com/waitlist" style="font-family:'Archivo Black',Arial,sans-serif;font-size:17px;font-weight:900;color:#111111;text-decoration:none;display:block;text-transform:uppercase;letter-spacing:1px;">Claim Your Spot &rarr;</a>
          </td>
        </tr>
      </table>
      <a href="https://veqiro.com" style="font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;font-weight:600;color:#EFE7D6;text-decoration:underline;opacity:0.7;">Or explore the product first</a>
    </td>
  </tr>

  <!-- PERKS LINE -->
  <tr>
    <td style="padding:28px 0 0 0;text-align:center;">
      <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:15px;color:#111111;font-weight:700;margin:0;">&#10003; 7-Day Free Trial &nbsp;&nbsp;&middot;&nbsp;&nbsp; &#10003; 30% Off First Subscription</p>
    </td>
  </tr>

  <!-- CREW SECTION HEADING -->
  <tr>
    <td style="padding:52px 0 24px 0;text-align:center;">
      <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#111111;opacity:0.45;margin:0 0 14px 0;">THE FULL GANG</p>
      <h2 class="section-h" style="font-family:'Archivo Black',Arial,sans-serif;font-size:32px;font-weight:900;color:#111111;margin:0;line-height:1.2;">6 AI Employees.<br/>All Included.</h2>
    </td>
  </tr>

  <!-- AGENT ROW 1: Vega + Scout -->
  <tr>
    <td style="padding:0 0 14px 0;">
      <table class="two-col" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td class="agent-card" width="48%" style="background-color:#6FCDE8;border:2px solid #111111;border-radius:9px;padding:26px;box-shadow:4px 4px 0 #111111;vertical-align:top;">
            <img src="https://veqiro.com/Vega.jpeg" alt="Vega" width="68" height="68" style="display:block;border-radius:50%;border:2px solid #111111;margin-bottom:14px;object-fit:cover;" />
            <p style="font-family:'Archivo Black',Arial,sans-serif;font-size:20px;color:#111111;margin:0 0 3px 0;">Vega</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;font-weight:700;color:#0E5C74;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Executive Assistant</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;color:#111111;line-height:1.55;margin:0;">Your right hand, 24/7. Triages your inbox, books meetings, and drafts replies that sound exactly like you. Zero nudging required.</p>
          </td>
          <td class="spacer-col" width="4%" style="padding:0;"></td>
          <td class="agent-card" width="48%" style="background-color:#F5C518;border:2px solid #111111;border-radius:9px;padding:26px;box-shadow:4px 4px 0 #111111;vertical-align:top;">
            <img src="https://veqiro.com/Scout.jpeg" alt="Scout" width="68" height="68" style="display:block;border-radius:50%;border:2px solid #111111;margin-bottom:14px;object-fit:cover;" />
            <p style="font-family:'Archivo Black',Arial,sans-serif;font-size:20px;color:#111111;margin:0 0 3px 0;">Scout</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;font-weight:700;color:#7A5A00;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Research &amp; Strategist</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;color:#111111;line-height:1.55;margin:0;">Finds the signal, skips the noise. Deep competitor teardowns and market memos, so you stop living in browser tabs.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- AGENT ROW 2: Maya + Sage -->
  <tr>
    <td style="padding:0 0 14px 0;">
      <table class="two-col" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td class="agent-card" width="48%" style="background-color:#F06464;border:2px solid #111111;border-radius:9px;padding:26px;box-shadow:4px 4px 0 #111111;vertical-align:top;">
            <img src="https://veqiro.com/Maya.jpeg" alt="Maya" width="68" height="68" style="display:block;border-radius:50%;border:2px solid #111111;margin-bottom:14px;object-fit:cover;" />
            <p style="font-family:'Archivo Black',Arial,sans-serif;font-size:20px;color:#111111;margin:0 0 3px 0;">Maya</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;font-weight:700;color:#7A1717;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Content &amp; Marketing</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;color:#111111;line-height:1.55;margin:0;">Visuals first. Copy that matches. On-brand campaigns, carousels, and posts with your logo, your palette, your voice. Ready to publish.</p>
          </td>
          <td class="spacer-col" width="4%" style="padding:0;"></td>
          <td class="agent-card" width="48%" style="background-color:#F79FD4;border:2px solid #111111;border-radius:9px;padding:26px;box-shadow:4px 4px 0 #111111;vertical-align:top;">
            <img src="https://veqiro.com/Sage.jpeg" alt="Sage" width="68" height="68" style="display:block;border-radius:50%;border:2px solid #111111;margin-bottom:14px;object-fit:cover;" />
            <p style="font-family:'Archivo Black',Arial,sans-serif;font-size:20px;color:#111111;margin:0 0 3px 0;">Sage</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;font-weight:700;color:#8E2A6A;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">SEO Specialist</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;color:#111111;line-height:1.55;margin:0;">Ranks pages in her sleep. Keyword research, SEO-optimised content, and site audits so your pages actually show up.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- AGENT ROW 3: Lex + Rex -->
  <tr>
    <td style="padding:0 0 0 0;">
      <table class="two-col" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td class="agent-card" width="48%" style="background-color:#8A8AF0;border:2px solid #111111;border-radius:9px;padding:26px;box-shadow:4px 4px 0 #111111;vertical-align:top;">
            <img src="https://veqiro.com/Lex.jpeg" alt="Lex" width="68" height="68" style="display:block;border-radius:50%;border:2px solid #111111;margin-bottom:14px;object-fit:cover;" />
            <p style="font-family:'Archivo Black',Arial,sans-serif;font-size:20px;color:#111111;margin:0 0 3px 0;">Lex</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;font-weight:700;color:#2A2A7A;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Legal Assistant</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;color:#111111;line-height:1.55;margin:0;">Reads the fine print so you don't. Reviews contracts, spots the traps, and explains every clause in plain English. Never legalese.</p>
          </td>
          <td class="spacer-col" width="4%" style="padding:0;"></td>
          <td class="agent-card" width="48%" style="background-color:#1DBC87;border:2px solid #111111;border-radius:9px;padding:26px;box-shadow:4px 4px 0 #111111;vertical-align:top;">
            <img src="https://veqiro.com/Rex.jpeg" alt="Rex" width="68" height="68" style="display:block;border-radius:50%;border:2px solid #111111;margin-bottom:14px;object-fit:cover;" />
            <p style="font-family:'Archivo Black',Arial,sans-serif;font-size:20px;color:#111111;margin:0 0 3px 0;">Rex</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;font-weight:700;color:#0E5C3F;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px 0;">Data Analyst &amp; Finance</p>
            <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;color:#111111;line-height:1.55;margin:0;">Makes spreadsheets sing. Turns your numbers into a clear story: MRR, burn rate, CAC, churn. Flags the weird stuff before it hurts.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr><td style="height:28px;"></td></tr>

  <!-- CLOSING CTA BLOCK -->
  <tr>
    <td class="close-pad" style="background-color:#111111;border:2px solid #111111;border-radius:10px;padding:52px 44px;text-align:center;box-shadow:6px 6px 0 #1DBC87;">
      <h2 class="close-h" style="font-family:'Archivo Black',Arial,sans-serif;font-size:30px;font-weight:900;color:#EFE7D6;margin:0 0 14px 0;line-height:1.2;">
        100 Spots.<br/>Yours to Claim.
      </h2>
      <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:15px;color:#EFE7D6;opacity:0.75;margin:0 0 6px 0;">Join the waitlist as a founding member and lock in:</p>
      <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:15px;color:#F5C518;font-weight:700;margin:0 0 36px 0;">&#10003; 7-Day Free Trial &nbsp;&nbsp;&middot;&nbsp;&nbsp; &#10003; 30% Off First Subscription</p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 14px auto;">
        <tr>
          <td style="background-color:#F5C518;border:2px solid #EFE7D6;border-radius:7px;padding:15px 40px;box-shadow:4px 4px 0 #EFE7D6;">
            <a href="https://veqiro.com/waitlist" style="font-family:'Archivo Black',Arial,sans-serif;font-size:16px;font-weight:900;color:#111111;text-decoration:none;display:block;text-transform:uppercase;letter-spacing:1px;">Join the Waitlist &rarr;</a>
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="border:2px solid #EFE7D6;border-radius:7px;padding:12px 32px;">
            <a href="https://veqiro.com" style="font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;font-weight:600;color:#EFE7D6;text-decoration:none;display:block;text-transform:uppercase;letter-spacing:1px;">Explore the Product</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <tr><td style="height:32px;"></td></tr>

  <!-- FOOTER -->
  <tr>
    <td style="text-align:center;padding:0 0 24px 0;">
      <img src="https://veqiro.com/logo.png" alt="Veqiro" width="96" style="display:block;margin:0 auto 16px auto;" />
      <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:12px;color:#111111;opacity:0.45;margin:0 0 16px 0;">Veqiro &mdash; Hire Your AI Crew &mdash; veqiro.com</p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px auto;">
        <tr>
          <td style="padding:0 7px;">
            <a href="https://x.com/veqiro_" style="display:inline-block;background-color:#111111;border-radius:50%;width:36px;height:36px;text-align:center;line-height:36px;text-decoration:none;font-family:'Space Grotesk',Arial,sans-serif;font-size:13px;font-weight:700;color:#EFE7D6;">X</a>
          </td>
          <td style="padding:0 7px;">
            <a href="https://www.linkedin.com/company/veqiro" style="display:inline-block;background-color:#111111;border-radius:50%;width:36px;height:36px;text-align:center;line-height:36px;text-decoration:none;font-family:'Space Grotesk',Arial,sans-serif;font-size:12px;font-weight:700;color:#EFE7D6;">in</a>
          </td>
          <td style="padding:0 7px;">
            <a href="https://www.instagram.com/veqiro_" style="display:inline-block;background-color:#111111;border-radius:50%;width:36px;height:36px;text-align:center;line-height:36px;text-decoration:none;font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;font-weight:700;color:#EFE7D6;">ig</a>
          </td>
        </tr>
      </table>
      <p style="font-family:'Space Grotesk',Arial,sans-serif;font-size:11px;color:#111111;opacity:0.28;margin:0;line-height:1.7;">
        You're receiving this because you showed interest in AI-powered tools for startups.<br/>
        <a href="#unsubscribe" style="color:#111111;text-decoration:underline;opacity:0.5;">Unsubscribe</a> &nbsp;&middot;&nbsp; <a href="mailto:info@veqiro.com" style="color:#111111;text-decoration:underline;opacity:0.5;">info@veqiro.com</a>
      </p>
    </td>
  </tr>

</table>

</td></tr>
</table>

</body>
</html>`;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function sendBulkAnnouncement() {
  try {
    // Verify BREVO_API_KEY is loaded from .env
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error("❌ BREVO_API_KEY is not set in .env — cannot send emails.");
      process.exit(1);
    }
    console.log(`🔑 BREVO_API_KEY loaded: ${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`);

    console.log("📧 Veqiro Announcement — Bulk Email Script");
    console.log(`   Subject : ${SUBJECT}`);
    console.log(`   Sender  : ${SENDER.name} <${SENDER.email}>`);
    if (TEST_MODE) console.log(`   Mode    : TEST — sending to ${TEST_EMAILS.length} test recipients`);
    else if (DRY_RUN) console.log(`   Mode    : DRY RUN — no emails will be sent`);
    else console.log(`   Mode    : LIVE SEND — emails will go out`);
    console.log("");

    await dbConnect();
    console.log("✅ Database connected");

    let recipients: { email: string; fullName: string }[];

    if (TEST_MODE) {
      recipients = TEST_EMAILS;
      console.log(`📊 Test mode: ${TEST_EMAILS.length} recipients`);
      TEST_EMAILS.forEach((r) => console.log(`   - ${r.email}`));
    } else {
      const users = await UserModel.find({}, "email fullName").lean();
      recipients = users.map((u) => ({ email: u.email, fullName: u.fullName }));
      console.log(`📊 Found ${recipients.length} users in database`);
    }

    if (recipients.length === 0) {
      console.log("ℹ️  No recipients. Exiting.");
      process.exit(0);
    }

    const batches = chunkArray(recipients, BATCH_SIZE);
    console.log(`📦 ${batches.length} batch(es) of up to ${BATCH_SIZE} per API call\n`);

    if (DRY_RUN) {
      batches.forEach((batch, i) => {
        console.log(`  Batch ${i + 1} (${batch.length} users):`);
        batch.forEach((u) => console.log(`    - ${u.email} (${u.fullName})`));
      });
      console.log("\n✅ Dry run complete. No emails were sent.");
      process.exit(0);
    }

    const api = new TransactionalEmailsApi();
    api.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

    let totalSent = 0;
    const failedBatches: { batchIndex: number; emails: string[]; error: string }[] = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`📤 Sending batch ${i + 1}/${batches.length} (${batch.length} recipients)...`);

      try {
        await api.sendTransacEmail({
          sender: SENDER,
          subject: SUBJECT,
          htmlContent: HTML_CONTENT,
          messageVersions: batch.map((user) => ({
            to: [{ email: user.email, name: user.fullName }],
          })),
        });
        totalSent += batch.length;
        console.log(`   ✅ Batch ${i + 1} sent (${batch.length} emails)`);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Batch ${i + 1} failed: ${msg}`);
        failedBatches.push({
          batchIndex: i + 1,
          emails: batch.map((u) => u.email),
          error: msg,
        });
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📈 SEND SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Emails sent   : ${totalSent}`);
    console.log(`❌ Failed emails : ${failedBatches.reduce((sum, b) => sum + b.emails.length, 0)}`);
    if (failedBatches.length > 0) {
      console.log("\nFailed batches:");
      failedBatches.forEach(({ batchIndex, emails, error }) => {
        console.log(`  Batch ${batchIndex} — ${error}`);
        emails.forEach((e) => console.log(`    - ${e}`));
      });
    }
    console.log("\n✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  }
}

sendBulkAnnouncement();
