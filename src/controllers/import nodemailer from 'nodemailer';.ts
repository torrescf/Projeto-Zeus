import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

export async function sendPasswordResetEmail(email: string, token: string) {
  await transporter.sendMail({
    to: email,
    subject: 'Redefinição de senha',
    html: `<a href="${process.env.APP_URL}/reset-password?token=${token}">Clique aqui para redefinir sua senha</a>`
  });
}
