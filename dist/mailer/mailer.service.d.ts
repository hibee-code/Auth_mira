import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private transporter;
    constructor(configService: ConfigService);
    sendWelcomeAndVerificationEmail(email: string, firstName: string, userType: string, code: string): Promise<void>;
    sendResendOtpEmail(email: string, firstName: string, code: string): Promise<void>;
    sendPasswordReset(email: string, code: string): Promise<void>;
    private sendMail;
    private getEmailSubject;
    private getWelcomeVerificationTemplate;
    private getResendOtpTemplate;
    private getWelcomeMessage;
}
