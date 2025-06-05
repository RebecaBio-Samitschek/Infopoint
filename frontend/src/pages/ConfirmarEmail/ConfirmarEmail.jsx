import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ConfirmarEmail.css';

const ConfirmarEmail = () => {
  const [mensagem, setMensagem] = useState('Confirmando...');
  const [erro, setErro] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setMensagem('Token inválido.');
      setErro(true);
      return;
    }

    axios
      .get(`http://localhost:5000/api/clientes/confirmar-email?token=${token}`)
      .then((res) => {
        setMensagem(res.data.mensagem || 'E-mail confirmado com sucesso!');
      })
      .catch((err) => {
        console.error(err);
        const msg = err.response?.data?.mensagem;

        if (msg === 'E-mail já confirmado.') {
          setMensagem('E-mail já confirmado.');
        } else {
          setMensagem('Link inválido ou expirado.');
        }

        setErro(true);
      });
  }, []);

  useEffect(() => {
    if (mensagem === 'E-mail confirmado com sucesso!') {
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    }
  }, [mensagem]);

  return (
    <div className="confirmar-page">
      <img
        src={`${process.env.PUBLIC_URL}/imagens/Img-fundo.svg`}
        alt="Fundo"
        className="fundo-confirmar"
      />

      <div className={`card-confirmacao ${erro ? 'erro' : 'sucesso'}`}>
        <h2>{mensagem}</h2>
        <a href="/login" className="link-voltar">Voltar para o login</a>
      </div>
    </div>
  );
};

export default ConfirmarEmail;
