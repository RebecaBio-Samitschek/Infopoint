const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const enviarEmailConfirmacao = async (cliente) => {
  const token = jwt.sign({ email: cliente.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

  const link = `${process.env.FRONTEND_URL}/confirmar-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: cliente.email,
    subject: 'Confirme seu e-mail - InfoPoint',
    html: `<p>Olá ${cliente.nome},</p>
           <p>Confirme seu e-mail clicando no link abaixo:</p>
           <a href="${link}">Confirmar E-mail</a>
           <p>Este link expira em 24h.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = enviarEmailConfirmacao;
