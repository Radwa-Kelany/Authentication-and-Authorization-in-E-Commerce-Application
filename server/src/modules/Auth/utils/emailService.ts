import nodemailer from 'nodemailer';

export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendPasswordResetEmail(email: string, resetLink: string) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <h2>Password Reset Request</h2>
        
        <p>You requested to reset your password.</p>

        <p>
          <a href="${resetLink}">
            Reset Password
          </a>
        </p>

        <p>This link expires in 15 minutes.</p>

        <p>If you didn't request this, you can ignore this email.</p>
      `,
    });
  }


  async sendOTPEmail(to: string, otp: string) {

    const info = await this.transporter.sendMail({
      from: `"MyApp" <${process.env.MAIL_FROM}>`,
      to,
      subject: 'Your verification code',
      text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
      html: `
      <div style="font-family: sans-serif; max-width: 400px;">
        <h2>Verify your email</h2>
        <p>Use the code below to complete your registration:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 13px;">
          This code expires in 10 minutes. Do not share it with anyone.
        </p>
      </div>
    `,
    });
  }
}
