import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { OtpModule } from '../otp/otp.module';
import { MailerModule } from '../mailer/mailer.module';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from '../common/guards/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'change_this',
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '3600s' },
      }),
    }),
    UsersModule,
    OtpModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, { provide: APP_GUARD, useClass: JwtAuthGuard }, { provide: APP_GUARD, useClass: RolesGuard }],
  exports: [AuthService],
})
export class AuthModule {}
