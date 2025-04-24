"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = sendPasswordResetEmail;
exports.sendBudgetStatusEmail = sendBudgetStatusEmail;
exports.sendBudgetStatusNotification = sendBudgetStatusNotification;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
async function sendPasswordResetEmail(email, token) {
    await transporter.sendMail({
        to: email,
        subject: "Redefinição de senha",
        html: `<a href="${process.env.APP_URL}/reset-password?token=${token}">Clique aqui para redefinir sua senha</a>`
    });
}
async function sendBudgetStatusEmail(budget, previousStatus) {
    const recipients = [budget.createdBy.email];
    await transporter.sendMail({
        to: recipients,
        subject: `Status do Orçamento ${budget.id} Alterado`,
        html: `O status mudou de ${previousStatus} para ${budget.status}`
    });
}
async function sendBudgetStatusNotification(budget, previousStatus) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: budget.createdBy.email,
        subject: `Status do Orçamento #${budget.id} Atualizado`,
        html: `
            <p>O status do orçamento <strong>${budget.title}</strong> foi alterado:</p>
            <p>De: ${previousStatus}</p>
            <p>Para: ${budget.status}</p>
            <p>Acesse o sistema para mais detalhes.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
}
//# sourceMappingURL=emailService.js.map