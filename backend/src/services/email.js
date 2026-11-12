import nodemailer from 'nodemailer';
export async function sendOtpEmail(email, otp, purpose) {
  if (process.env.DEV_OTP === 'true' && process.env.NODE_ENV !== 'production') {
    console.log(`[DEV OTP] ${purpose} for ${email}: ${otp}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM, to: email, subject: 'Your MONOLOGUE verification code',
    text: `Your ${purpose} code is ${otp}. It expires in 5 minutes.`,
    html: `<div style="font-family:Arial;padding:24px"><h2>MONOLOGUE</h2><p>Your verification code:</p><h1>${otp}</h1><p>It expires in 5 minutes.</p></div>`
  });
}
