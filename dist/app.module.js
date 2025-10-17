"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const configuration_1 = require("./config/configuration");
const mailer_module_1 = require("./mailer/mailer.module");
const auth_module_1 = require("./auth/auth.module");
const otp_module_1 = require("./otp/otp.module");
const users_module_1 = require("./users/users.module");
const throttler_1 = require("@nestjs/throttler");
const auth_attempts_service_1 = require("./auth/auth-attempts.service");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    uri: configService.get('MONGO_URI') || 'mongodb://localhost:27017/edmira',
                    autoIndex: true,
                }),
            }),
            mailer_module_1.MailerModule,
            users_module_1.UsersModule,
            otp_module_1.OtpModule,
            auth_module_1.AuthModule,
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (cfg) => ({
                    ttl: cfg.get('THROTTLE_TTL') || 60,
                    limit: cfg.get('THROTTLE_LIMIT') || 10,
                }),
            }),
        ],
        providers: [
            auth_attempts_service_1.AuthAttemptsService,
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map