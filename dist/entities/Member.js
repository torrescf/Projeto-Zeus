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
exports.Member = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Budget_1 = require("./Budget");
const Project_1 = require("./Project");
const Penalty_1 = require("./Penalty");
let Member = class Member {
    id;
    name;
    email;
    password;
    role; // 'admin', 'member', 'intern'
    isActive;
    resetPasswordToken;
    resetPasswordExpires;
    skills;
    gender;
    phone;
    photo;
    budgets;
    ledProjects;
    penalties;
};
exports.Member = Member;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Member.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Member.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.Matches)(/^[\w-.]+@compjunior\.com\.br$/, {
        message: 'O e-mail deve pertencer ao domínio @compjunior.com.br',
    }),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Member.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Member.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Member.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "timestamp", nullable: true }),
    __metadata("design:type", Date)
], Member.prototype, "resetPasswordExpires", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-array", { nullable: true }),
    __metadata("design:type", Array)
], Member.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "photo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Budget_1.Budget, (budget) => budget.createdBy),
    __metadata("design:type", Array)
], Member.prototype, "budgets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Project_1.Project, (project) => project.leader),
    __metadata("design:type", Array)
], Member.prototype, "ledProjects", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Penalty_1.Penalty, (penalty) => penalty.member),
    __metadata("design:type", Array)
], Member.prototype, "penalties", void 0);
exports.Member = Member = __decorate([
    (0, typeorm_1.Entity)('members')
], Member);
//# sourceMappingURL=Member.js.map