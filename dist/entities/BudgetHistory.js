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
exports.BudgetHistory = void 0;
const typeorm_1 = require("typeorm");
const Budget_1 = require("./Budget");
const Member_1 = require("./Member");
let BudgetHistory = class BudgetHistory {
    id;
    action; // 'CREATE', 'UPDATE', 'STATUS_CHANGE'
    previousData;
    newData;
    budget;
    changedBy;
    createdAt;
};
exports.BudgetHistory = BudgetHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BudgetHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BudgetHistory.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], BudgetHistory.prototype, "previousData", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb'),
    __metadata("design:type", Object)
], BudgetHistory.prototype, "newData", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Budget_1.Budget, (budget) => budget.history),
    __metadata("design:type", Budget_1.Budget)
], BudgetHistory.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Member_1.Member),
    __metadata("design:type", Member_1.Member)
], BudgetHistory.prototype, "changedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], BudgetHistory.prototype, "createdAt", void 0);
exports.BudgetHistory = BudgetHistory = __decorate([
    (0, typeorm_1.Entity)()
], BudgetHistory);
//# sourceMappingURL=BudgetHistory.js.map