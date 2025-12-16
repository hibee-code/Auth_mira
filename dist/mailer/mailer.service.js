"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = require("nodemailer");
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.transporter = nodemailer.createTransport({
            host: this.getEnv('MAIL_HOST'),
            port: Number(this.getEnv('MAIL_PORT')),
            secure: false,
            auth: {
                user: this.getEnv('MAIL_USER'),
                pass: this.getEnv('MAIL_PASSWORD'),
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
    async onModuleInit() {
        try {
            await this.transporter.verify();
            this.logger.log('Gmail SMTP connection established successfully');
        }
        catch (error) {
            this.logger.error(' Gmail SMTP connection failed', error);
            throw error;
        }
    }
    async sendWelcomeAndVerificationEmail(email, firstName, userType, code) {
        await this.sendMail({
            to: email,
            subject: 'Welcome to EdMira Verify Your Account',
            html: this.getWelcomeVerificationTemplate(firstName, userType, code),
        });
    }
    async sendResendOtpEmail(email, firstName, code) {
        await this.sendMail({
            to: email,
            subject: 'EdMira Your New Verification Code',
            html: this.getResendOtpTemplate(firstName, code),
        });
    }
    async sendPasswordReset(email, code) {
        await this.sendMail({
            to: email,
            subject: 'Reset Your Password EdMira',
            html: `
        <h2>Password Reset</h2>
        <p>Your reset code is:</p>
        <div style="font-size:24px;font-weight:bold;color:#0a4d68;">${code}</div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
      `,
        });
    }
    async sendMail(options) {
        try {
            await this.transporter.sendMail({
                from: `EdMira <${this.getEnv('MAIL_FROM')}>`,
                ...options,
            });
            this.logger.log(`Email sent to ${options.to}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${options.to}`, error);
            throw error;
        }
    }
    getEnv(key) {
        const value = this.configService.get(key);
        if (!value) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
        return value;
    }
    getWelcomeVerificationTemplate(firstName, userType, code) {
        const welcomeMessage = this.getWelcomeMessage(firstName, userType);
        return `
      <html>
        <body style="font-family: Arial, sans-serif; background:#f6f8fa;">
          <div style="max-width:600px;margin:auto;background:#fff;padding:20px;border-radius:8px;">
            <h1 style="background:#0a4d68;color:#fff;padding:15px;text-align:center;">
              Welcome to EdMira
            </h1>
            <p>${welcomeMessage}</p>
            <p>Please verify your email using the code below:</p>
            <div style="font-size:28px;font-weight:bold;color:#0a4d68;text-align:center;">
              ${code}
            </div>
            <p>This code expires in <strong>10 minutes</strong>.</p>
            <hr />
            <small>&copy; ${new Date().getFullYear()} EdMira</small>
          </div>
        </body>
      </html>
    `;
    }
    getResendOtpTemplate(firstName, code) {
        return `
      <html>
        <body>
          <h2>Hello ${firstName},</h2>
          <p>Your new verification code:</p>
          <div style="font-size:28px;font-weight:bold;color:#0a4d68;">
            ${code}
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>EdMira Team</p>
        </body>
      </html>
    `;
    }
    getWelcomeMessage(firstName, userType) {
        if (userType === 'STUDENT') {
            return `Hello ${firstName}! Welcome to EdMira, your learning companion.`;
        }
        if (userType === 'PROFESSIONAL') {
            return `Hello Dr. ${firstName}! Welcome to EdMira, share knowledge and mentor others.`;
        }
        return `Hello ${firstName}! Welcome to EdMira.`;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=mailer.service.js.map