// ...existing code...
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import configuration from './config/configuration';
import { MailerModule } from './mailer/mailer.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthAttemptsService } from './auth/auth-attempts.service';
import { APP_GUARD } from '@nestjs/core';
// ...existing code...

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/edmira',
        autoIndex: true,
      }),
    }),
    MailerModule,
    UsersModule,
    OtpModule,
    AuthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        ttl: cfg.get<number>('THROTTLE_TTL') || 60,
        limit: cfg.get<number>('THROTTLE_LIMIT') || 10,
      } as any),
    }),
  ],
  providers: [
    AuthAttemptsService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
// ...existing code...