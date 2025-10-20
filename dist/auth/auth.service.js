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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcrypt");
const mailer_service_1 = require("../mailer/mailer.service");
const user_type_enum_1 = require("../common/enum/user-type.enum");
const otp_service_1 = require("../otp/otp.service");
const jwt_1 = require("@nestjs/jwt");
const user_model_1 = require("../users/model/user.model");
let AuthService = class AuthService {
    constructor(userModel, emailService, otpService, jwtService) {
        this.userModel = userModel;
        this.emailService = emailService;
        this.otpService = otpService;
        this.jwtService = jwtService;
    }
    async signup(signupDto) {
        const { password, userType, studentProfile, professionalProfile, ...rest } = signupDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({
            ...rest,
            password: hashedPassword,
            userType,
            studentProfile: userType !== user_type_enum_1.UserType.PROFESSIONAL ? studentProfile : undefined,
            professionalProfile: userType !== user_type_enum_1.UserType.STUDENT ? professionalProfile : undefined,
        });
        const savedUser = await user.save();
        const otpCode = await this.otpService.createOtp(savedUser.id, savedUser.email);
        await this.emailService.sendWelcomeAndVerificationEmail(savedUser.email, savedUser.firstName, userType, otpCode);
        return savedUser;
    }
    async verifyEmail(dto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        await this.otpService.verifyOtp(user._id, dto.code);
        user.isVerified = true;
        await user.save();
        return { message: 'Email verified successfully' };
    }
    async resendOtp(dto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const otp = await this.otpService.createOtp(user._id, user.email);
        await this.emailService.sendResendOtpEmail(user.email, user.firstName, otp);
        return { message: 'New verification code sent successfully.' };
    }
    async login(dto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!user.isVerified)
            throw new common_1.UnauthorizedException('Please verify your email first');
        const payload = { sub: user._id, email: user.email, userType: user.userType };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken };
    }
    async forgotPassword(dto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        const otp = await this.otpService.createOtp(user._id, user.email);
        await this.emailService.sendPasswordReset(user.email, otp);
        return { message: 'Password reset code sent' };
    }
    async resetPassword(dto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user)
            throw new common_1.BadRequestException('User not found');
        await this.otpService.verifyOtp(user._id, dto.code);
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await user.save();
        return { message: 'Password reset successful' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mailer_service_1.EmailService,
        otp_service_1.OtpService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map