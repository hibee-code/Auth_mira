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
exports.userModel = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const gender_enum_1 = require("../../common/enum/gender.enum");
const phoneNumber_schema_1 = require("../schema/phoneNumber.schema");
const address_schema_1 = require("../schema/address.schema");
const user_type_enum_1 = require("../../common/enum/user-type.enum");
const studentProfile_schema_1 = require("../schema/studentProfile.schema");
const professionalProfile_schema_1 = require("../schema/professionalProfile.schema");
const hybridProfile_schema_1 = require("../schema/hybridProfile.schema");
let User = class User {
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ computed: true }),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], User.prototype, "fullName", null);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Object.values(gender_enum_1.GenderType) }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: phoneNumber_schema_1.PhoneNumberSchema }),
    __metadata("design:type", phoneNumber_schema_1.PhoneNumber)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: address_schema_1.AddressSchema }),
    __metadata("design:type", address_schema_1.Address)
], User.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: Object.values(user_type_enum_1.UserType) }),
    __metadata("design:type", String)
], User.prototype, "userType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: studentProfile_schema_1.StudentProfileSchema }),
    __metadata("design:type", studentProfile_schema_1.StudentProfile)
], User.prototype, "studentProfile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: professionalProfile_schema_1.ProfessionalProfileSchema }),
    __metadata("design:type", professionalProfile_schema_1.ProfessionalProfile)
], User.prototype, "professionalProfile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: hybridProfile_schema_1.HybridProfileSchema }),
    __metadata("design:type", hybridProfile_schema_1.HybridProfile)
], User.prototype, "hybridProfile", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], User.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'State' }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], User.prototype, "stateId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.default.Schema.Types.ObjectId)
], User.prototype, "lastModifiedBy", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)()
], User);
exports.userModel = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.model.js.map