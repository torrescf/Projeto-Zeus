// Serviço responsável por enviar e-mails, como redefinição de senha e notificações.
// Utiliza o Nodemailer para gerenciar o envio de mensagens.

import nodemailer from 'nodemailer';
import { Budget } from "../../database/entities/Budget";
import { Project } from "../../database/entities/Project";
import { AppDataSource } from "../../database/data-source"; // Adicione esta linha

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export async function sendPasswordResetEmail(email: string, token: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:4001';
    const expirationHours = 24; // Token expires in 24 hours
    const supportEmail = "joao.machado@compjunior.com.br";
    const logoUrl = "https://imgur.com/a/plscfhN"; // Use o link direto da logo ou ajuste conforme necessário
    const html = `
        <div style="text-align:center; margin-bottom:24px;">
            <img src="${logoUrl}" alt="Comp Júnior" style="max-width:220px; height:auto; margin-bottom:16px;" />
        </div>
        <p>Olá,</p>
        <p>Recebemos uma solicitação para redefinir a senha da conta associada a este e-mail (${email}).</p>
        <p><strong>Ação necessária:</strong></p>
        <p><a href="${appUrl}/reset-password?token=${token}" style="background-color: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Redefinir senha</a></p>
        <p>Este link de redefinição de senha expirará em ${expirationHours} horas.</p>
        <p><strong>Se você não solicitou esta alteração:</strong></p>
        <p>Por favor, ignore este e-mail - sua senha permanecerá a mesma. Se estiver preocupado com a segurança de sua conta, entre em contato com nossa equipe de suporte em ${supportEmail}.</p>
        <p>Atenciosamente,<br/>Equipe de Suporte</p>
        <p style="font-size: 12px; color: #666;">Por questões de segurança, não responda a este e-mail. Se precisar de ajuda, entre em contato conosco em ${supportEmail}.</p>
    `;
    await transporter.sendMail({
        from: `"Suporte da Empresa" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Redefinição de senha para sua conta",
        html
    });
}

export async function sendBudgetStatusEmail(budget: Budget, previousStatus: string) {
    // Ajuste: buscar dados do projeto relacionado ao orçamento
    let project: Project | undefined = undefined;
    if (budget.project) {
        project = budget.project as Project;
    } else if ((budget as any).projectId) {
        const projectRepo = AppDataSource.getRepository(Project);
        const foundProject = await projectRepo.findOne({ where: { id: (budget as any).projectId } });
        project = foundProject || undefined;
    }

    // Não há membro responsável nem status diretamente em Budget, então envie para o email do cliente do projeto, se existir
    let recipientEmail = "";
    if (project && project.client && project.client.email) {
        recipientEmail = project.client.email;
    }

    if (!recipientEmail) {
        throw new Error("O email do cliente do projeto não foi encontrado.");
    }

    await transporter.sendMail({
        from: `"Sistema de Orçamentos" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Status do Orçamento do Projeto ${project?.name || "Projeto"} Alterado`,
        html: `
            <p>Olá,</p>
            <p>O status do orçamento do projeto <strong>${project?.name || "Projeto"}</strong> foi alterado.</p>
            <p>De: ${previousStatus}</p>
            <p>Para: (novo status não disponível)</p>
            <p>Acesse o sistema para mais detalhes.</p>
            <p>Atenciosamente,<br/>
            Equipe de Orçamentos CompJr</p>
        `,
    });
}

export async function sendBudgetStatusNotification(budget: Budget, previousStatus: string) {
    return sendBudgetStatusEmail(budget, previousStatus);
}