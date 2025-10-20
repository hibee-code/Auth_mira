// src/mail/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
    });
  }

  /** 🔹 Send unified Welcome + Verification Email */
  async sendWelcomeAndVerificationEmail(
    email: string,
    firstName: string,
    userType: string,
    code: string,
  ): Promise<void> {
    const subject = this.getEmailSubject('welcome_verify');
    const html = this.getWelcomeVerificationTemplate(firstName, userType, code);
    await this.sendMail(email, subject, html);
  }

  /** 🔹 Send Resend OTP Email (when user requests another OTP) */
  async sendResendOtpEmail(email: string, firstName: string, code: string): Promise<void> {
    const subject = this.getEmailSubject('resend_otp');
    const html = this.getResendOtpTemplate(firstName, code);
    await this.sendMail(email, subject, html);
  }

  /** 🔹 Send Password Reset Email */
  async sendPasswordReset(email: string, code: string): Promise<void> {
    const subject = this.getEmailSubject('reset');
    const html = `
      <h2>Password Reset</h2>
      <p>Your password reset code is:</p>
      <div style="font-size:24px;font-weight:bold;color:#0a4d68;">${code}</div>
      <p>This code expires in <strong>10 minutes</strong>.</p>
    `;
    await this.sendMail(email, subject, html);
  }

  /** 🔹 Internal Mail Sender */
  private async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: `EdMira <${this.configService.get('MAIL_FROM')}>`,
      to,
      subject,
      html,
    };
    await this.transporter.sendMail(mailOptions);
  }

  /** 🔹 Dynamic Subject Resolver */
  private getEmailSubject(type: string): string {
    switch (type) {
      case 'welcome_verify':
        return 'Welcome to EdMira - Verify Your Account';
      case 'resend_otp':
        return 'EdMira - Your New Verification Code';
      case 'reset':
        return 'Reset Your Password - EdMira';
      default:
        return 'EdMira Notification';
    }
  }

  /** 🔹 Welcome Template (for signup) */
  private getWelcomeVerificationTemplate(
    firstName: string,
    userType: string,
    code: string,
  ): string {
    const welcomeMessage = this.getWelcomeMessage(firstName, userType);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; background-color: #f6f8fa; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px; }
            .header { background-color: #0a4d68; color: white; text-align: center; padding: 15px; border-radius: 8px 8px 0 0; }
            .content { padding: 25px; line-height: 1.6; }
            .code-box { background-color: #eef6ff; border: 2px dashed #0a4d68; text-align: center; padding: 15px; margin: 20px 0; border-radius: 6px; }
            .code { font-size: 28px; font-weight: bold; color: #0a4d68; letter-spacing: 4px; }
            .footer { text-align: center; color: #777; font-size: 12px; padding: 10px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>Welcome to EdMira!</h1></div>
            <div class="content">
              <p>${welcomeMessage}</p>
              <p>Please verify your email using the code below:</p>
              <div class="code-box"><div class="code">${code}</div></div>
              <p>This code will expire in <strong>10 minutes</strong>.</p>
            </div>
            <div class="footer">&copy; ${new Date().getFullYear()} EdMira</div>
          </div>
        </body>
      </html>
    `;
  }

  /** 🔹 Template for Resent OTP Email */
  private getResendOtpTemplate(firstName: string, code: string): string {
    return `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>Hello ${firstName},</h2>
          <p>Your new verification code is:</p>
          <div style="font-size:28px;font-weight:bold;color:#0a4d68;">${code}</div>
          <p>This code expires in <strong>10 minutes</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <p>– The EdMira Team</p>
        </body>
      </html>
    `;
  }

  /** 🔹 Personalized Welcome Text */
  private getWelcomeMessage(firstName: string, userType: string): string {
    if (userType === 'STUDENT') {
      return `Hello ${firstName}! 🎓 Welcome to EdMira — your learning companion where you can connect with mentors and access premium medical learning materials.`;
    }
    if (userType === 'PROFESSIONAL') {
      return `Hello Dr. ${firstName}! 👨‍⚕️ Welcome to EdMira — a place to share your expertise, mentor future medical professionals, and grow with the community.`;
    }
    return `Hello ${firstName}! 🌍 Welcome to EdMira — your hybrid access to both student and professional features.`;
  }
}
