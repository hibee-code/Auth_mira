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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const moment = require("moment");
const otp_schema_1 = require("./schema/otp.schema");
let OtpService = class OtpService {
    constructor(otpModel) {
        this.otpModel = otpModel;
    }
    generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    async createOtp(userId, email) {
        const otpCode = this.generateOtpCode();
        const expiresAt = moment().add(10, 'minutes').toDate();
        await this.otpModel.deleteMany({ userId });
        await this.otpModel.create({
            userId,
            email,
            code: otpCode,
            expiresAt,
            attemptCount: 0,
            verified: false,
        });
        return otpCode;
    }
    async verifyOtp(userId, code) {
        const otp = await this.otpModel.findOne({ userId });
        if (!otp)
            throw new common_1.BadRequestException('OTP not found');
        if (otp.attemptCount >= 3) {
            throw new common_1.BadRequestException('Account locked due to multiple failed OTP attempts');
        }
        if (moment().isAfter(otp.expiresAt)) {
            throw new common_1.BadRequestException('OTP has expired');
        }
        if (otp.code !== code) {
            otp.attemptCount += 1;
            await otp.save();
            const remaining = 3 - otp.attemptCount;
            throw new common_1.BadRequestException(`Invalid OTP. ${remaining > 0 ? `${remaining} attempt(s) left.` : 'Account locked.'}`);
        }
        otp.verified = true;
        otp.attemptCount = 0;
        await otp.save();
        return true;
    }
    async resendOtp(userId, email) {
        await this.otpModel.deleteMany({ userId });
        const newCode = this.generateOtpCode();
        const expiresAt = moment().add(10, 'minutes').toDate();
        await this.otpModel.create({
            userId,
            email,
            code: newCode,
            expiresAt,
            attemptCount: 0,
            verified: false,
        });
        return newCode;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OtpService);
//# sourceMappingURL=otp.service.js.map