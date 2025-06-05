import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext'; 
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', senha: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [manterConectado, setManterConectado] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido.';
    }
    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória.';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const response = await axios.post('http://localhost:5000/api/clientes/login', formData);
        const { token, clienteId, nome, reenviado, mensagem  } = response.data;

        if (reenviado) {
          alert(mensagem);
          return;
        }

        login({ token, clienteId, nome });
        alert('Login realizado com sucesso!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert(error.response?.data?.mensagem || 'Erro ao fazer login.');
      }
    }
  };

  return (
    <div className="login-page">
      <img
        src={`${process.env.PUBLIC_URL}/imagens/3.svg`}
        alt="Fundo Login"
        className="login-bg"
      />

      <div className="form-container">
        <h2 className="titulo">Bem-vindo de volta!</h2>
        <p className="subtitulo">
          Ainda não tem uma conta? <Link to="/cadastro">Crie agora</Link>
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <div className="senha-container">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
            />
            <button
              type="button"
              className="olho-btn"
              onClick={() => setMostrarSenha(!mostrarSenha)}
            >
              {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.senha && <span className="error">{errors.senha}</span>}

          <div className="linha-opcoes">
            <label>
              <input
                type="checkbox"
                checked={manterConectado}
                onChange={() => setManterConectado(!manterConectado)}
              />
              Manter-me conectado
            </label>

            <Link to="/recuperar-senha" className="esqueci-senha-link">
              Esqueceu a senha?
            </Link>
          </div>

          <button type="submit" className="btn-login">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
