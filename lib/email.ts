import nodemailer, { type Transporter } from "nodemailer";

// Envoi d'e-mails via la boîte OVH contact@kompa-invest.fr (SMTP).
let transporter: Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "smtp.mail.ovh.net",
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  await getTransporter().sendMail({
    from: `Kompa <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    replyTo: opts.replyTo,
  });
}
