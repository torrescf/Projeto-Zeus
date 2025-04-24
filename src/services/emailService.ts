import nodemailer from 'nodemailer';
import { Budget } from "../entities/Budget";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export async function sendPasswordResetEmail(email: string, token: string) {
  await transporter.sendMail({
    to: email,
    subject: "Redefinição de senha",
    html: `<a href="${process.env.APP_URL}/reset-password?token=${token}">Clique aqui para redefinir sua senha</a>`
  });
}

export async function sendBudgetStatusEmail(budget: Budget, previousStatus: string) {
    const recipients = [budget.createdBy.email];
    await transporter.sendMail({
        to: recipients,
        subject: `Status do Orçamento ${budget.id} Alterado`,
        html: `O status mudou de ${previousStatus} para ${budget.status}`
    });
}

export async function sendBudgetStatusNotification(budget: Budget, previousStatus: string) {
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
