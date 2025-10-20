import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { Otp } from './schema/otp.schema';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
  ) {}

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOtp(userId: string, email: string): Promise<string> {
    const otpCode = this.generateOtpCode();
    const expiresAt = moment().add(10, 'minutes').toDate();

    // Delete old OTPs for the same user
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

  async verifyOtp(userId: string, code: string): Promise<boolean> {
    const otp = await this.otpModel.findOne({ userId });

    if (!otp) throw new BadRequestException('OTP not found');

    // If too many failed attempts
    if (otp.attemptCount >= 3) {
      throw new BadRequestException('Account locked due to multiple failed OTP attempts');
    }

    // Check expiration
    if (moment().isAfter(otp.expiresAt)) {
      throw new BadRequestException('OTP has expired');
    }

    // Incorrect code
    if (otp.code !== code) {
      otp.attemptCount += 1;
      await otp.save();
      const remaining = 3 - otp.attemptCount;
      throw new BadRequestException(
        `Invalid OTP. ${remaining > 0 ? `${remaining} attempt(s) left.` : 'Account locked.'}`,
      );
    }

    // Correct code
    otp.verified = true;
    otp.attemptCount = 0;
    await otp.save();

    return true;
  }

  /**
   * Resend OTP — resets attemptCount and verified state
   */
  async resendOtp(userId: string, email: string): Promise<string> {
    // Remove all existing OTPs and reset
    await this.otpModel.deleteMany({ userId });

    // Create a new OTP with reset state
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
}
