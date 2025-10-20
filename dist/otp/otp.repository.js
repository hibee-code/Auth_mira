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
exports.OtpRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const otp_schema_1 = require("./schema/otp.schema");
let OtpRepository = class OtpRepository {
    constructor(otpModel) {
        this.otpModel = otpModel;
    }
    create(payload) {
        return this.otpModel.create(payload);
    }
    findLatest(userId) {
        return this.otpModel.findOne({ userId }).sort({ createdAt: -1 }).exec();
    }
    markUsed(otpId) {
        return this.otpModel.findByIdAndUpdate(otpId, { isUsed: true }, { new: true }).exec();
    }
    incrementAttempts(otpId) {
        return this.otpModel.findByIdAndUpdate(otpId, { $inc: { attempts: 1 } }, { new: true }).exec();
    }
};
exports.OtpRepository = OtpRepository;
exports.OtpRepository = OtpRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(otp_schema_1.Otp.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OtpRepository);
//# sourceMappingURL=otp.repository.js.map