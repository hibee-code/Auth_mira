declare const _default: () => {
    PORT: number;
    MONGO_URI: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    OTP_EXPIRES_MINUTES: number;
    OTP_RESEND_COOLDOWN_SECONDS: number;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USER: string;
    SMTP_PASS: string;
    EMAIL_FROM: string;
    THROTTLE_TTL: number;
    THROTTLE_LIMIT: number;
    AUTH_LOCK_ATTEMPTS: number;
    AUTH_LOCK_TTL_SECONDS: number;
};
export default _default;
