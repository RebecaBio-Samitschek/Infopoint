import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RedefinirSenha.css';

const RedefinirSenha = () => {
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    setToken(tokenParam);

    if (!tokenParam) {
      setMensagem('Token inválido ou expirado.');
      setErro(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/clientes/redefinir-senha', {
        token,
        novaSenha,
      });

      setMensagem('Senha redefinida com sucesso! Redirecionando...');
      setErro(false);
      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (error) {
      console.error(error);
      setMensagem(error.response?.data?.mensagem || 'Erro ao redefinir senha.');
      setErro(true);
    }
  };

  return (
    <div className="redefinir-page">
      <img
        src={`${process.env.PUBLIC_URL}/imagens/Img-fundo.svg`}
        alt="Fundo"
        className="fundo-redefinir"
      />

      <div className="card-redefinir">
        <h2 className="titulo-redifinir">Redefinir sua senha</h2>
        <p className="subtitulo">Digite a nova senha abaixo para continuar.</p>

        <form className="form-redefinir" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />
          <button type="submit">Redefinir</button>
        </form>

        {mensagem && (
          <p className={erro ? 'mensagem erro' : 'mensagem sucesso'}>{mensagem}</p>
        )}
      </div>
    </div>
  );
};

export default RedefinirSenha;
