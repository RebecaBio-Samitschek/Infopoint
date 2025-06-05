import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Cadastro.css";

const Cadastro = () => {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  });

  const [errosCampos, setErrosCampos] = useState({});
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erroGeral, setErroGeral] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMostrarSenha = () => setMostrarSenha(!mostrarSenha);
  const toggleMostrarConfirmar = () => setMostrarConfirmarSenha(!mostrarConfirmarSenha);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novosErros = {};

    if (!form.nome.trim()) novosErros.nome = "Nome é obrigatório.";
    if (!form.email.trim()) {
      novosErros.email = "E-mail é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      novosErros.email = "E-mail inválido.";
    }

    if (!form.senha.trim()) {
      novosErros.senha = "Senha é obrigatória.";
    } else if (form.senha.length < 6) {
      novosErros.senha = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (form.senha !== form.confirmarSenha) {
      novosErros.confirmarSenha = "As senhas não coincidem.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosCampos(novosErros);
      return;
    }

    setErrosCampos({});
    setErroGeral("");

    try {
      await axios.post("http://localhost:5000/api/clientes", {
        nome: form.nome,
        email: form.email,
        senha: form.senha
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErroGeral(error.response?.data?.mensagem || "Erro ao cadastrar.");
    }
  };

  return (
    <div className="cadastro-page">
      <img
        src={`${process.env.PUBLIC_URL}/imagens/3.svg`}
        alt="Fundo Cadastro"
        className="cadastro-bg"
      />

      <div className="form-container">
        <h2 className="titulo">Criar Conta</h2>
        <p className="subtitulo">
          Já possui uma conta? <Link to="/login">Entrar</Link>
        </p>

        <form className="cadastro-form" onSubmit={handleSubmit}>
          {erroGeral && <p className="error">{erroGeral}</p>}

          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={form.nome}
            onChange={handleChange}
          />
          {errosCampos.nome && <span className="error">{errosCampos.nome}</span>}

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
          />
          {errosCampos.email && <span className="error">{errosCampos.email}</span>}

          <div className="senha-container">
            <input
              type={mostrarSenha ? "text" : "password"}
              name="senha"
              placeholder="Senha"
              value={form.senha}
              onChange={handleChange}
            />
            <button type="button" onClick={toggleMostrarSenha} className="olho-btn">
              {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errosCampos.senha && <span className="error">{errosCampos.senha}</span>}

          <div className="senha-container">
            <input
              type={mostrarConfirmarSenha ? "text" : "password"}
              name="confirmarSenha"
              placeholder="Confirmar Senha"
              value={form.confirmarSenha}
              onChange={handleChange}
            />
            <button type="button" onClick={toggleMostrarConfirmar} className="olho-btn">
              {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errosCampos.confirmarSenha && (
            <span className="error">{errosCampos.confirmarSenha}</span>
          )}

          <button type="submit" className="btn-cadastro">Cadastrar</button>

          <div className="botoes-extra">
            <Link to="/" className="btn-link">Voltar para início</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
