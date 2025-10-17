"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const users_module_1 = require("../users/users.module");
const otp_module_1 = require("../otp/otp.module");
const mailer_module_1 = require("../mailer/mailer.module");
const jwt_strategy_1 = require("./jwt.strategy");
const roles_guard_1 = require("../common/guards/roles.guard");
const core_1 = require("@nestjs/core");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET') || 'change_this',
                    signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') || '3600s' },
                }),
            }),
            users_module_1.UsersModule,
            otp_module_1.OtpModule,
            mailer_module_1.MailerModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard }, { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard }],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map