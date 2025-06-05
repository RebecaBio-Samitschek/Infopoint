const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviarEmailRecuperacao = async (cliente) => {
  const token = jwt.sign({ email: cliente.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const link = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

  console.log('Enviando recuperação para:', cliente.email);
  console.log('TOKEN:', token);
  console.log('LINK:', link);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: cliente.email,
    subject: 'Recuperação de Senha - InfoPoint',
    html: `<p>Olá ${cliente.nome},</p>
           <p>Você solicitou a redefinição de senha. Clique no link abaixo:</p>
           <a href="${link}">Redefinir Senha</a>
           <p>Este link é válido por 1 hora.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = enviarEmailRecuperacao;
