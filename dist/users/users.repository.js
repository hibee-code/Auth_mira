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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_schema_1 = require("./schema/users.schema");
let UsersRepository = class UsersRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(userData) {
        const existingEmail = await this.userModel.findOne({
            email: userData.email,
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Email already registered');
        }
        const existingUsername = await this.userModel.findOne({
            username: userData.username,
        });
        if (existingUsername) {
            throw new common_1.ConflictException('Username already taken');
        }
        const hashedPassword = userData.password ? await require('bcrypt').hash(userData.password, 10) : undefined;
        const profileCompletion = this.calculateProfileCompletion ? this.calculateProfileCompletion(userData) : 100;
        const user = new this.userModel({
            ...userData,
            password: hashedPassword,
            profileCompletionPercentage: profileCompletion,
            isProfileComplete: profileCompletion === 100,
        });
        return user.save();
    }
    calculateProfileCompletion(userData) {
        if (userData.firstName && userData.lastName && userData.email && userData.password) {
            return 100;
        }
        return 0;
    }
    findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    findById(id) {
        return this.userModel.findById(id).exec();
    }
    async markEmailVerified(userId) {
        return this.userModel.findByIdAndUpdate(userId, { isEmailVerified: true }, { new: true }).exec();
    }
    async updatePassword(userId, hashedPassword) {
        return this.userModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true }).exec();
    }
    async applyReferral(newUserId, referralCode) {
        const referrer = await this.userModel.findOne({ 'referral.code': referralCode }).exec();
        if (!referrer)
            return null;
        await this.userModel.findByIdAndUpdate(referrer._id, { $inc: { 'referral.creditPoints': 1 } }).exec();
        return this.userModel.findByIdAndUpdate(newUserId, { 'referral.referredBy': referrer._id }).exec();
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map