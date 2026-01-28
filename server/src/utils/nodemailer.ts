import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_APP_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  try {
    console.log(`[sendEmail] Attempting to send email to: ${to}, Service: gmail`);
    console.log(
      `[sendEmail] Using Auth Email: ${process.env.GOOGLE_APP_EMAIL ? 'PRESENT' : 'MISSING'}`,
    );
    console.log(
      `[sendEmail] Using Auth Password: ${process.env.GOOGLE_APP_PASSWORD ? 'PRESENT' : 'MISSING'}`,
    );

    const info = await transporter.sendMail({
      from: `"MessageMind" <${process.env.GOOGLE_APP_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`[sendEmail] Email sent successfully. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`[sendEmail] Error sending email:`, error);
    throw error;
  }
}
