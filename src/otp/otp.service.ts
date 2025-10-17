import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { OTP_PURPOSE } from '../common/constants';

@Injectable()
export class OtpService {
  constructor(private repo: OtpRepository, private config: ConfigService) {}

  private generateCode() {
    // 6-digit numeric code
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOtp(userId: string | Types.ObjectId, purpose: string) {
    const minutes = this.config.get<number>('OTP_EXPIRES_MINUTES') || 10;
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
  const objectId = typeof userId === 'string' ? new Types.ObjectId(userId) : userId;
  const otp = await this.repo.create({ userId: objectId as Types.ObjectId, code, purpose, expiresAt });
    return otp;
  }

  async canResend(userId: string | Types.ObjectId, purpose: string) {
    const latest = await this.repo.findLatest(userId, purpose);
    if (!latest) return true;
    const cooldown = this.config.get<number>('OTP_RESEND_COOLDOWN_SECONDS') || 60;
    const nextAllowed = new Date(latest.createdAt.getTime() + cooldown * 1000);
    return Date.now() >= nextAllowed.getTime();
  }

  async verifyOtp(userId: string | Types.ObjectId, code: string, purpose: string) {
    const latest = await this.repo.findLatest(userId, purpose);
    if (!latest) throw new NotFoundException('OTP not found');
    if (latest.isUsed) throw new BadRequestException('OTP already used');
    if (latest.code !== code) throw new BadRequestException('Invalid OTP code');
    if (latest.expiresAt.getTime() < Date.now()) throw new BadRequestException('OTP expired');

    await this.repo.markUsed(latest._id.toString());
    return latest;
  }
}
