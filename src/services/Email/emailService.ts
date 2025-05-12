// Serviço responsável por enviar e-mails, como redefinição de senha e notificações.
// Utiliza o Nodemailer para gerenciar o envio de mensagens.

import nodemailer from 'nodemailer';
import { Budget } from "../../database/entities/Budget";

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
    const recipientEmail = budget.membroResponsavelId?.toString(); // Convertendo ID para string temporariamente

    if (!recipientEmail) {
        throw new Error("O email do membro responsável não foi encontrado.");
    }

    await transporter.sendMail({
        to: recipientEmail,
        subject: `Status do Orçamento ${budget.numeroOrcamento} Alterado`,
        html: `
            <p>O status do orçamento <strong>${budget.descricaoProjeto}</strong> foi alterado:</p>
            <p>De: ${previousStatus}</p>
            <p>Para: ${budget.status}</p>
            <p>Acesse o sistema para mais detalhes.</p>
        `,
    });
}

export async function sendBudgetStatusNotification(budget: Budget, previousStatus: string) {
    const recipientEmail = budget.membroResponsavelId?.toString(); // Convertendo ID para string temporariamente

    if (!recipientEmail) {
        throw new Error("O email do membro responsável não foi encontrado.");
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `Status do Orçamento #${budget.numeroOrcamento} Atualizado`,
        html: `
            <p>O status do orçamento <strong>${budget.descricaoProjeto}</strong> foi alterado:</p>
            <p>De: ${previousStatus}</p>
            <p>Para: ${budget.status}</p>
            <p>Acesse o sistema para mais detalhes.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
}
