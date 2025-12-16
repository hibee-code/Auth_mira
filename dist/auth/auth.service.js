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
const config_1 = require("@nestjs/config");
const user_model_1 = require("../users/model/user.model");
let AuthService = class AuthService {
    constructor(userModel, emailService, otpService, jwtService, configService) {
        this.userModel = userModel;
        this.emailService = emailService;
        this.otpService = otpService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signup(signupDto) {
        this.validateProfiles(signupDto);
        const existingUser = await this.userModel.findOne({ email: signupDto.email });
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
        }
        const { password, userType, studentProfile, professionalProfile, ...rest } = signupDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({
            ...rest,
            password: hashedPassword,
            userType,
            studentProfile: (userType === user_type_enum_1.UserType.STUDENT || userType === user_type_enum_1.UserType.HYBRID)
                ? studentProfile
                : undefined,
            professionalProfile: (userType === user_type_enum_1.UserType.PROFESSIONAL || userType === user_type_enum_1.UserType.HYBRID)
                ? professionalProfile
                : undefined,
        });
        const savedUser = await user.save();
        try {
            const otpCode = await this.otpService.createOtp(savedUser.id, savedUser.email);
            await this.emailService.sendWelcomeAndVerificationEmail(savedUser.email, savedUser.firstName, userType, otpCode);
        }
        catch (error) {
            console.error('Failed to send welcome email:', error);
        }
        const userObject = savedUser.toObject();
        delete userObject.password;
        return {
            message: 'Signup successful. Please check your email for the verification code.',
            user: userObject,
        };
    }
    validateProfiles(dto) {
        if (dto.userType === user_type_enum_1.UserType.STUDENT && !dto.studentProfile) {
            throw new common_1.BadRequestException('Student profile is required for Student users');
        }
        if (dto.userType === user_type_enum_1.UserType.PROFESSIONAL && !dto.professionalProfile) {
            throw new common_1.BadRequestException('Professional profile is required for Professional users');
        }
        if (dto.userType === user_type_enum_1.UserType.HYBRID) {
            if (!dto.studentProfile || !dto.professionalProfile) {
                throw new common_1.BadRequestException('Both Student and Professional profiles are required for Hybrid users');
            }
        }
    }
    async verifyOtp(dto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (user.isVerified) {
            return { message: 'User is already verified' };
        }
        try {
            await this.otpService.verifyOtp(user._id, dto.code);
            user.isVerified = true;
            await user.save();
            return { message: 'OTP verified successfully. Account activated.' };
        }
        catch (error) {
            console.error(`OTP Verification failed for ${dto.email}:`, error.message);
            throw error;
        }
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
        const tokens = await this.getTokens(user._id, user.email, user.userType);
        await this.updateRtHash(user._id, tokens.refreshToken);
        return tokens;
    }
    async logout(userId) {
        await this.userModel.updateOne({ _id: userId }, { refreshToken: null });
    }
    async refreshTokens(userId, rt) {
        const user = await this.userModel.findById(userId);
        if (!user || !user.refreshToken)
            throw new common_1.UnauthorizedException('Access Denied');
        const rtMatches = await bcrypt.compare(rt, user.refreshToken);
        if (!rtMatches)
            throw new common_1.UnauthorizedException('Access Denied');
        const tokens = await this.getTokens(user._id, user.email, user.userType);
        await this.updateRtHash(user._id, tokens.refreshToken);
        return tokens;
    }
    async updateRtHash(userId, rt) {
        const hash = await bcrypt.hash(rt, 10);
        await this.userModel.updateOne({ _id: userId }, { refreshToken: hash });
    }
    async getTokens(userId, email, userType) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email, userType }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync({ sub: userId, email, userType }, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: '7d',
            }),
        ]);
        return {
            accessToken: at,
            refreshToken: rt,
        };
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
            throw new common_1.BadRequestException('Email not found');
        await this.otpService.verifyOtp(user._id, dto.code);
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await user.save();
        return { message: 'Password reset successful' };
    }
    async validateSocialLogin(profile) {
        const { email, firstName, lastName, socialId, provider, picture } = profile;
        let user = await this.userModel.findOne({ email });
        if (user) {
            if (!user.socialId) {
                user.socialId = socialId;
                user.provider = provider;
                await user.save();
            }
            return user;
        }
        const randomPassword = Math.random().toString(36).slice(-8) + '1A!';
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        user = new this.userModel({
            email,
            firstName,
            lastName,
            username: email.split('@')[0],
            password: hashedPassword,
            socialId,
            provider,
            userType: user_type_enum_1.UserType.STUDENT,
            isVerified: true,
        });
        await user.save();
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mailer_service_1.EmailService,
        otp_service_1.OtpService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map