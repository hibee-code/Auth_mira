import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Otp } from './schema/otp.schema';
import { SALT_ROUNDS } from '../common/config/constants';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private readonly otpModel: Model<Otp>,
  ) { }

  private generateOtpCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  async createOtp(userId: Types.ObjectId, email: string): Promise<string> {
    const otpCode = this.generateOtpCode();
    const hashedCode = await bcrypt.hash(otpCode, SALT_ROUNDS);
    const expiresAt = moment().add(10, 'minutes').toDate();

    await this.otpModel.deleteMany({ userId });

    await this.otpModel.create({
      userId,
      email,
      code: hashedCode,
      expiresAt,
      attemptCount: 0,
      verified: false,
    });

    return otpCode; // Return plaintext to send via email
  }

  async verifyOtp(userId: Types.ObjectId, code: string): Promise<boolean> {
    const otp = await this.otpModel.findOne({
      userId,
    });

    if (!otp) {
      throw new BadRequestException('OTP not found');
    }

    if (otp.attemptCount >= 3) {
      throw new BadRequestException('Account locked due to multiple failed OTP attempts');
    }

    if (moment().isAfter(otp.expiresAt)) {
      throw new BadRequestException('OTP has expired');
    }

    const isMatch = await bcrypt.compare(code, otp.code);
    if (!isMatch) {
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

  async resendOtp(userId: Types.ObjectId, email: string): Promise<string> {
    await this.otpModel.deleteMany({ userId });

    const newCode = this.generateOtpCode();
    const hashedCode = await bcrypt.hash(newCode, SALT_ROUNDS);
    const expiresAt = moment().add(10, 'minutes').toDate();

    await this.otpModel.create({
      userId,
      email,
      code: hashedCode,
      expiresAt,
      attemptCount: 0,
      verified: false,
    });

    return newCode; // Return plaintext to send via email
  }
}

