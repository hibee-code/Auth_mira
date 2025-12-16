import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class EmailService implements OnModuleInit {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    sendWelcomeAndVerificationEmail(email: string, firstName: string, userType: string, code: string): Promise<void>;
    sendResendOtpEmail(email: string, firstName: string, code: string): Promise<void>;
    sendPasswordReset(email: string, code: string): Promise<void>;
    private sendMail;
    private getEnv;
    private getWelcomeVerificationTemplate;
    private getResendOtpTemplate;
    private getWelcomeMessage;
}
