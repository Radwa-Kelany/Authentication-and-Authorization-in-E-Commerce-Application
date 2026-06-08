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

  async sendPasswordResetEmail(
    email: string,
    resetLink: string,
  ) {
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
}