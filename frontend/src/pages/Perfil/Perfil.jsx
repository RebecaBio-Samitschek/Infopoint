import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logoInfoPoint from "../../assets/landing/logo-infopoint.png";
import "./Perfil.css";

const Perfil = () => {
  const [cliente, setCliente] = useState({ nome: "", email: "" });
  const [formSenha, setFormSenha] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
    senhaExcluir: ""
  });

  const [mostrar, setMostrar] = useState({
    atual: false,
    nova: false,
    confirmar: false,
    excluir: false
  });

  const [erros, setErros] = useState({});
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/clientes/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCliente({ ...res.data, nomeOriginal: res.data.nome });
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    };

    carregarPerfil();
  }, []);

  const handleNomeChange = (e) => {
    setCliente({ ...cliente, nome: e.target.value });
  };

  const handleSenhaChange = (e) => {
    const { name, value } = e.target;
    setFormSenha((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMostrar = (campo) => {
    setMostrar((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    const novosErros = {};
    setMensagemSucesso("");

    const { senhaAtual, novaSenha, confirmarSenha } = formSenha;
    const nomeAtual = cliente.nome?.trim();
    const houveAlteracaoNome = nomeAtual !== cliente.nomeOriginal;
    const querAlterarSenha = senhaAtual || novaSenha || confirmarSenha;

    if (!houveAlteracaoNome && !querAlterarSenha) {
      setErros({ geral: "Nenhuma alteração realizada." });
      return;
    }

    if (!nomeAtual) novosErros.nome = "Nome é obrigatório.";

    if (querAlterarSenha) {
      if (!senhaAtual) novosErros.senhaAtual = "Informe a senha atual.";
      if (!novaSenha) novosErros.novaSenha = "Informe a nova senha.";
      else if (novaSenha.length < 6)
        novosErros.novaSenha = "Nova senha deve ter no mínimo 6 caracteres.";
      if (novaSenha === senhaAtual)
        novosErros.novaSenha = "Nova senha não pode ser igual à atual.";
      if (!confirmarSenha)
        novosErros.confirmarSenha = "Confirme a nova senha.";
      else if (novaSenha !== confirmarSenha)
        novosErros.confirmarSenha = "As senhas não coincidem.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/clientes/me",
        {
          nome: nomeAtual,
          senhaAtual: senhaAtual || undefined,
          novaSenha: novaSenha || undefined
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagemSucesso("Perfil atualizado com sucesso!");
      setErros({});
      setCliente((prev) => ({ ...prev, nomeOriginal: nomeAtual }));
      setFormSenha({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
    } catch (err) {
      const msg = err.response?.data?.mensagem || "Erro ao atualizar perfil.";
      setErros({ geral: msg });
    }
  };

  const handleExcluirConta = async () => {
    const senha = formSenha.senhaExcluir?.trim();

    if (!senha) {
      setErros({ senhaExcluir: "Digite sua senha para confirmar." });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:5000/api/clientes/me", {
        headers: { Authorization: `Bearer ${token}` },
        data: { senhaAtual: senha }
      });

      alert("Conta excluída com sucesso.");
      localStorage.clear();
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.mensagem || "Erro ao excluir conta.";
      setErros({ senhaExcluir: msg });
    }
  };

  return (
    <div className="perfil-container">
      <div className="navbar-dashboard">
        <img src={logoInfoPoint} alt="Logo InfoPoint" className="logo-navbar" />
        <button className="btn-voltar" onClick={() => navigate("/dashboard")}>
          Voltar para o Dashboard
        </button>
      </div>

      <div className="perfil-scroll">
        <h1 className="titulo">Meu Perfil</h1>

        <div className="perfil-cards">
          <form className="card-perfil" onSubmit={handleSalvar}>
            {erros.geral && <p className="error">{erros.geral}</p>}
            {mensagemSucesso && <p className="success">{mensagemSucesso}</p>}

            <label>Nome</label>
            <input type="text" value={cliente.nome} onChange={handleNomeChange} />
            {erros.nome && <span className="error">{erros.nome}</span>}

            <label>Email</label>
            <input type="email" value={cliente.email} disabled />

            <label>Senha Atual</label>
            <div className="senha-container">
              <input
                type={mostrar.atual ? "text" : "password"}
                name="senhaAtual"
                value={formSenha.senhaAtual}
                onChange={handleSenhaChange}
                placeholder="Senha atual"
              />
              <button type="button" onClick={() => toggleMostrar("atual")} className="olho-btn">
                {mostrar.atual ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {erros.senhaAtual && <span className="error">{erros.senhaAtual}</span>}

            <label>Nova Senha</label>
            <div className="senha-container">
              <input
                type={mostrar.nova ? "text" : "password"}
                name="novaSenha"
                value={formSenha.novaSenha}
                onChange={handleSenhaChange}
                placeholder="Nova senha"
              />
              <button type="button" onClick={() => toggleMostrar("nova")} className="olho-btn">
                {mostrar.nova ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {erros.novaSenha && <span className="error">{erros.novaSenha}</span>}

            <label>Confirmar Nova Senha</label>
            <div className="senha-container">
              <input
                type={mostrar.confirmar ? "text" : "password"}
                name="confirmarSenha"
                value={formSenha.confirmarSenha}
                onChange={handleSenhaChange}
                placeholder="Confirmar nova senha"
              />
              <button type="button" onClick={() => toggleMostrar("confirmar")} className="olho-btn">
                {mostrar.confirmar ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {erros.confirmarSenha && <span className="error">{erros.confirmarSenha}</span>}

            <button type="submit" className="btn-primary">Salvar Alterações</button>
          </form>

          <div className="card-perfil excluir">
            <h3>Excluir Conta</h3>
            <p>Esta ação é irreversível. Confirme sua senha atual para excluir sua conta.</p>

            <div className="senha-container">
              <input
                type={mostrar.excluir ? "text" : "password"}
                name="senhaExcluir"
                placeholder="Senha atual"
                value={formSenha.senhaExcluir}
                onChange={handleSenhaChange}
              />
              <button type="button" className="olho-btn" onClick={() => toggleMostrar("excluir")}>
                {mostrar.excluir ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {erros.senhaExcluir && <span className="error">{erros.senhaExcluir}</span>}

            <button
              type="button"
              className="btn-secondary"
              style={{ backgroundColor: "#b30000", marginTop: "10px" }}
              onClick={handleExcluirConta}
            >
              Confirmar Exclusão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
