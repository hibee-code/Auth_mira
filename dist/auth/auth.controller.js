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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const signup_dto_1 = require("./dto/signup.dto");
const signup_student_dto_1 = require("./dto/signup-student.dto");
const signup_professional_dto_1 = require("./dto/signup-professional.dto");
const signup_hybrid_dto_1 = require("./dto/signup-hybrid.dto");
const login_dto_1 = require("./dto/login.dto");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
const resend_otp_dto_1 = require("./dto/resend-otp.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    signupStudent(dto) {
        return this.authService.signupStudent(dto);
    }
    signupProfessional(dto) {
        return this.authService.signupProfessional(dto);
    }
    signupHybrid(dto) {
        return this.authService.signupHybrid(dto);
    }
    login(dto) {
        return this.authService.login(dto);
    }
    verifyEmail(dto) {
        return this.authService.verifyEmail(dto);
    }
    resend(dto) {
        return this.authService.resendOtp(dto);
    }
    forgotPassword(dto) {
        return this.authService.forgotPassword(dto);
    }
    resetPassword(dto) {
        return this.authService.resetPassword(dto);
    }
    profile(req) {
        return this.authService.getProfile(req.user.userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignupDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('signup/student'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof signup_student_dto_1.SignupStudentDto !== "undefined" && signup_student_dto_1.SignupStudentDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signupStudent", null);
__decorate([
    (0, common_1.Post)('signup/professional'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof signup_professional_dto_1.SignupProfessionalDto !== "undefined" && signup_professional_dto_1.SignupProfessionalDto) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signupProfessional", null);
__decorate([
    (0, common_1.Post)('signup/hybrid'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof signup_hybrid_dto_1.SignupHybridDto !== "undefined" && signup_hybrid_dto_1.SignupHybridDto) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signupHybrid", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resend_otp_dto_1.ResendOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resend", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof reset_password_dto_1.ResetPasswordDto !== "undefined" && reset_password_dto_1.ResetPasswordDto) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "profile", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map