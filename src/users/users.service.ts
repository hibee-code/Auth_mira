import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private usersRepo: UsersRepository) {}

  async createUser(dto: SignupDto) {
    // Validation is handled by DTO and NestJS pipes
    try {
      const user = await this.usersRepo.create({
        firstName: dto.fullName.split(' ')[0],
        lastName: dto.fullName.split(' ').slice(1).join(' '),
        email: dto.email,
        password: dto.password,
        role: dto.role as UserRole,
      });
      return user;
    } catch (err: any) {
      if (err && err.code === 11000) {
        throw new ConflictException('Email already in use');
      }
      throw err;
    }
  }

  async validateUserCredentials(email: string, password: string) {
    const user = await this.usersRepo.findByEmail(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;
    return user;
  }

  findByEmail(email: string) {
    return this.usersRepo.findByEmail(email);
  }

  findById(id: string | Types.ObjectId) {
    return this.usersRepo.findById(id);
  }

  markEmailVerified(userId: string) {
    return this.usersRepo.markEmailVerified(userId);
  }

  async resetPassword(userId: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 12);
    return this.usersRepo.updatePassword(userId, hashed);
  }

  // Create a student user with profile
  async createStudentUser(dto: any) {
    try {
      const user = await this.usersRepo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
        email: dto.email,
        password: dto.password,
        countryCode: dto.countryCode,
        phoneNumber: dto.phoneNumber,
        role: UserRole.STUDENT,
        studentProfile: {
          institution: dto.institution,
          faculty: dto.faculty,
          department: dto.department,
          levelType: dto.levelType,
          level: dto.level,
        },
        termsAccepted: !!dto.termsAccepted,
        termsAcceptedAt: dto.termsAccepted ? new Date() : undefined,
      });
      // handle referral optionally
      if (dto.referralCode) {
        await this.usersRepo.applyReferral(user._id, dto.referralCode);
      }
      return user;
    } catch (err: any) {
      if (err && err.code === 11000) throw new ConflictException('Email or username already in use');
      throw err;
    }
  }

  async createProfessionalUser(dto: any) {
    try {
      const user = await this.usersRepo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
        email: dto.email,
        password: dto.password,
        countryCode: dto.countryCode,
        phoneNumber: dto.phoneNumber,
        role: UserRole.PROFESSIONAL,
        professionalProfile: {
          title: dto.title,
          fieldOfSpecialization: dto.fieldOfSpecialization,
          organization: dto.organization,
          yearsOfExperience: dto.yearsOfExperience,
        },
        termsAccepted: !!dto.termsAccepted,
        termsAcceptedAt: dto.termsAccepted ? new Date() : undefined,
      });
      if (dto.referralCode) {
        await this.usersRepo.applyReferral(user._id, dto.referralCode);
      }
      return user;
    } catch (err: any) {
      if (err && err.code === 11000) throw new ConflictException('Email or username already in use');
      throw err;
    }
  }

  async createHybridUser(dto: any) {
    try {
      const user = await this.usersRepo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
        email: dto.email,
        password: dto.password,
        countryCode: dto.countryCode,
        phoneNumber: dto.phoneNumber,
        role: UserRole.HYBRID,
        studentProfile: {
          institution: dto.institution,
          faculty: dto.faculty,
          department: dto.department,
          levelType: dto.levelType,
          level: dto.level,
        },
        professionalProfile: {
          title: dto.title,
          fieldOfSpecialization: dto.fieldOfSpecialization,
          organization: dto.organization,
          yearsOfExperience: dto.yearsOfExperience,
        },
        termsAccepted: !!dto.termsAccepted,
        termsAcceptedAt: dto.termsAccepted ? new Date() : undefined,
      });
      if (dto.referralCode) {
        await this.usersRepo.applyReferral(user._id, dto.referralCode);
      }
      return user;
    } catch (err: any) {
      if (err && err.code === 11000) throw new ConflictException('Email or username already in use');
      throw err;
    }
  }
}
