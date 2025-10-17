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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const bcrypt = require("bcrypt");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    constructor(usersRepo) {
        this.usersRepo = usersRepo;
    }
    async createUser(dto) {
        try {
            const user = await this.usersRepo.create({
                firstName: dto.fullName.split(' ')[0],
                lastName: dto.fullName.split(' ').slice(1).join(' '),
                email: dto.email,
                password: dto.password,
                role: dto.role,
            });
            return user;
        }
        catch (err) {
            if (err && err.code === 11000) {
                throw new common_1.ConflictException('Email already in use');
            }
            throw err;
        }
    }
    async validateUserCredentials(email, password) {
        const user = await this.usersRepo.findByEmail(email);
        if (!user)
            return null;
        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return null;
        return user;
    }
    findByEmail(email) {
        return this.usersRepo.findByEmail(email);
    }
    findById(id) {
        return this.usersRepo.findById(id);
    }
    markEmailVerified(userId) {
        return this.usersRepo.markEmailVerified(userId);
    }
    async resetPassword(userId, newPassword) {
        const hashed = await bcrypt.hash(newPassword, 12);
        return this.usersRepo.updatePassword(userId, hashed);
    }
    async createStudentUser(dto) {
        try {
            const user = await this.usersRepo.create({
                firstName: dto.firstName,
                lastName: dto.lastName,
                username: dto.username,
                email: dto.email,
                password: dto.password,
                countryCode: dto.countryCode,
                phoneNumber: dto.phoneNumber,
                role: user_schema_1.UserRole.STUDENT,
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
            if (dto.referralCode) {
                await this.usersRepo.applyReferral(user._id, dto.referralCode);
            }
            return user;
        }
        catch (err) {
            if (err && err.code === 11000)
                throw new common_1.ConflictException('Email or username already in use');
            throw err;
        }
    }
    async createProfessionalUser(dto) {
        try {
            const user = await this.usersRepo.create({
                firstName: dto.firstName,
                lastName: dto.lastName,
                username: dto.username,
                email: dto.email,
                password: dto.password,
                countryCode: dto.countryCode,
                phoneNumber: dto.phoneNumber,
                role: user_schema_1.UserRole.PROFESSIONAL,
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
        }
        catch (err) {
            if (err && err.code === 11000)
                throw new common_1.ConflictException('Email or username already in use');
            throw err;
        }
    }
    async createHybridUser(dto) {
        try {
            const user = await this.usersRepo.create({
                firstName: dto.firstName,
                lastName: dto.lastName,
                username: dto.username,
                email: dto.email,
                password: dto.password,
                countryCode: dto.countryCode,
                phoneNumber: dto.phoneNumber,
                role: user_schema_1.UserRole.HYBRID,
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
        }
        catch (err) {
            if (err && err.code === 11000)
                throw new common_1.ConflictException('Email or username already in use');
            throw err;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map