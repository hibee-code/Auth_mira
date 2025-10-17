import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendVerificationEmail(email: string, code: string, firstName: string): Promise<void>;
    sendPasswordResetEmail(email: string, code: string, firstName: string): Promise<void>;
    sendWelcomeEmail(email: string, firstName: string): Promise<void>;
    private getVerificationEmailTemplate;
    private getPasswordResetEmailTemplate;
    private getWelcomeEmailTemplate;
}
