// Serviço responsável por enviar e-mails, como redefinição de senha e notificações.
// Utiliza o Nodemailer para gerenciar o envio de mensagens.

import nodemailer from 'nodemailer';
import { Project } from "../../database/entities/Project";
import { AppDataSource } from "../../database/data-source"; // Adicione esta linha

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export async function sendPasswordResetEmail(email: string, token: string) {
    const appUrl = process.env.APP_URL || 'http://localhost:4001';
    const expirationHours = 24;
    const supportEmail = "joao.machado@compjunior.com.br";
    const logoUrl = "https://res.cloudinary.com/dqalvfs9e/image/upload/fl_preserve_transparency/v1747847190/Logotipo_Comp_Junior_ybqpes.jpg?_s=public-apps";
    const resetLink = `${appUrl}/auth/reset-password/${token}`;
    const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 32px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
  <div style="text-align:center; margin-bottom:24px;">
    <img src="${logoUrl}" alt="Comp Júnior" style="max-width:200px; height:auto;" />
  </div>
  <p style="font-size: 16px;">Olá,</p>
  <p style="font-size: 16px;">Recebemos uma solicitação para redefinir a senha da conta associada a este e-mail: <strong>${email}</strong>.</p>
  <p style="font-size: 16px;"><strong>Ação necessária:</strong></p>
  <div style="text-align: center; margin: 24px 0;">
    <a href="${resetLink}" style="background-color: #0066cc; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">Redefinir Senha</a>
  </div>
  <p style="font-size: 16px;">Este link de redefinição de senha expirará em <strong>${expirationHours} horas</strong>.</p>
  <p style="font-size: 16px;"><strong>Se você não solicitou esta alteração:</strong></p>
  <p style="font-size: 16px;">Por favor, ignore este e-mail. Sua senha permanecerá a mesma. Se estiver preocupado com a segurança de sua conta, entre em contato com nossa equipe de suporte pelo e-mail <a href="mailto:${supportEmail}" style="color: #0066cc;">${supportEmail}</a>.</p>
  <p style="font-size: 16px;">Atenciosamente,<br/><strong>Equipe de Suporte - Comp Júnior</strong></p>
  <hr style="margin: 32px 0; border: none; border-top: 1px solid #ddd;" />
  <p style="font-size: 12px; color: #888; text-align: center;">Por questões de segurança, não responda a este e-mail. Caso precise de ajuda, entre em contato conosco em <a href="mailto:${supportEmail}" style="color: #888;">${supportEmail}</a>.</p>
</div>
   `;
    await transporter.sendMail({
        from: `Suporte da Empresa <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Redefinição de senha para sua conta",
        html
    });
}

type Budget = any; // Ajuste: Budget não existe mais como entidade, use Project diretamente ou um tipo genérico

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