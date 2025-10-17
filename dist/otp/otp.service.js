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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const otp_repository_1 = require("./otp.repository");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("mongoose");
let OtpService = class OtpService {
    constructor(repo, config) {
        this.repo = repo;
        this.config = config;
    }
    generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async createOtp(userId, purpose) {
        const minutes = this.config.get('OTP_EXPIRES_MINUTES') || 10;
        const code = this.generateCode();
        const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
        const objectId = typeof userId === 'string' ? new mongoose_1.Types.ObjectId(userId) : userId;
        const otp = await this.repo.create({ userId: objectId, code, purpose, expiresAt });
        return otp;
    }
    async canResend(userId, purpose) {
        const latest = await this.repo.findLatest(userId, purpose);
        if (!latest)
            return true;
        const cooldown = this.config.get('OTP_RESEND_COOLDOWN_SECONDS') || 60;
        const nextAllowed = new Date(latest.createdAt.getTime() + cooldown * 1000);
        return Date.now() >= nextAllowed.getTime();
    }
    async verifyOtp(userId, code, purpose) {
        const latest = await this.repo.findLatest(userId, purpose);
        if (!latest)
            throw new common_1.NotFoundException('OTP not found');
        if (latest.isUsed)
            throw new common_1.BadRequestException('OTP already used');
        if (latest.code !== code)
            throw new common_1.BadRequestException('Invalid OTP code');
        if (latest.expiresAt.getTime() < Date.now())
            throw new common_1.BadRequestException('OTP expired');
        await this.repo.markUsed(latest._id.toString());
        return latest;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof otp_repository_1.OtpRepository !== "undefined" && otp_repository_1.OtpRepository) === "function" ? _a : Object, config_1.ConfigService])
], OtpService);
//# sourceMappingURL=otp.service.js.map