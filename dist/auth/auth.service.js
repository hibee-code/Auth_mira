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
const user_model_1 = require("../users/model/user.model");
const mailer_service_1 = require("../mailer/mailer.service");
const user_type_enum_1 = require("../common/enum/user-type.enum");
const otp_service_1 = require("../otp/otp.service");
let AuthService = class AuthService {
    constructor(userModel, emailService, otpService) {
        this.userModel = userModel;
        this.emailService = emailService;
        this.otpService = otpService;
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_model_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mailer_service_1.EmailService,
        otp_service_1.OtpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map