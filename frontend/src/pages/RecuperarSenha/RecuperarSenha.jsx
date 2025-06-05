import React, { useState } from 'react';
import axios from 'axios';
import './RecuperarSenha.css';

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/clientes/recuperar-senha', { email });
      setMensagem('Enviamos um link de recuperação para seu e-mail!');
      setErro(false);
    } catch (error) {
      console.error(error);
      setMensagem(error.response?.data?.mensagem || 'Erro ao enviar o e-mail.');
      setErro(true);
    }
  };

  return (
    <div className="recuperar-page">
      <img
        src={`${process.env.PUBLIC_URL}/imagens/Img-fundo.svg`}
        alt="Fundo"
        className="fundo-recuperar"
      />

      <div className="card-recuperacao">
        <h2 className="titulo-recuperar">Esqueceu sua senha?</h2>
        <p className="subtitulo">
          Não se preocupe! Enviaremos um link de redefinição para seu e-mail.
        </p>

        <form className="form-recuperar" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar link</button>
        </form>

        {mensagem && (
          <p className={erro ? 'mensagem erro' : 'mensagem sucesso'}>{mensagem}</p>
        )}
      </div>
    </div>
  );
};

export default RecuperarSenha;
