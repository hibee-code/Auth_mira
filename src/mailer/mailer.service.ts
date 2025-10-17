// src/auth/services/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
//import { OtpType } from '../../common/enums/otp-type.enum';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
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

  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string, code: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: `EdMira <${this.configService.get('MAIL_FROM')}>`,
      to: email,
      subject: 'Verify Your Email - EdMira',
      html: this.getVerificationEmailTemplate(firstName, code),
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, code: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: `EdMira <${this.configService.get('MAIL_FROM')}>`,
      to: email,
      subject: 'Reset Your Password - EdMira',
      html: this.getPasswordResetEmailTemplate(firstName, code),
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: `EdMira <${this.configService.get('MAIL_FROM')}>`,
      to: email,
      subject: 'Welcome to EdMira!',
      html: this.getWelcomeEmailTemplate(firstName),
    };

    await this.transporter.sendMail(mailOptions);
  }

  /**
   * Email template for verification
   */
  private getVerificationEmailTemplate(firstName: string, code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0a4d68; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .code-box { background-color: #fff; border: 2px dashed #0a4d68; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #0a4d68; letter-spacing: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { color: #d32f2f; font-size: 14px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EdMira</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>Thank you for registering with EdMira! Please use the verification code below to verify your email address.</p>
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              <p class="warning">If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EdMira. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Email template for password reset
   */
  private getPasswordResetEmailTemplate(firstName: string, code: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0a4d68; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .code-box { background-color: #fff; border: 2px dashed #d32f2f; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #d32f2f; letter-spacing: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .warning { color: #d32f2f; font-size: 14px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EdMira</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>We received a request to reset your password. Use the code below to proceed:</p>
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              <p>This code will expire in <strong>10 minutes</strong>.</p>
              <p class="warning">If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EdMira. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Welcome email template
   */
  private getWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0a4d68; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { background-color: #0a4d68; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to EdMira!</h1>
            </div>
            <div class="content">
              <h2>Hello ${firstName},</h2>
              <p>Your email has been successfully verified! Welcome to the EdMira community.</p>
              <p>You can now access all features and connect with other medical students and professionals.</p>
              <p>Thank you for joining us on this journey!</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EdMira. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}