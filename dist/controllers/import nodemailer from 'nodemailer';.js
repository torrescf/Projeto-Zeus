"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
async function sendPasswordResetEmail(email, token) {
    await transporter.sendMail({
        to: email,
        subject: 'Redefinição de senha',
        html: `<a href="${process.env.APP_URL}/reset-password?token=${token}">Clique aqui para redefinir sua senha</a>`
    });
}
//# sourceMappingURL=import%20nodemailer%20from%20'nodemailer';.js.map