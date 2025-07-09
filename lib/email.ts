import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT || 587),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendInviteEmail(to: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const link = `${baseUrl}/set-password?token=${token}`;
  const from = process.env.MAIL_FROM || 'no-reply@example.com';
  await transporter.sendMail({
    from,
    to,
    subject: 'School admin invitation',
    text: `Set your password here: ${link}`,
    html: `<p>Set your password <a href="${link}">here</a>.</p>`,
  });
}

export default transporter;

