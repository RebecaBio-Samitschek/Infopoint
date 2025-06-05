import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logoInfoPoint from "../../assets/landing/logo-infopoint.png";
import "./Permissoes.css";

function Permissoes() {
  const { paginaId } = useParams();
  const navigate = useNavigate();
  const [permissoes, setPermissoes] = useState([]);
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("editor");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const carregarPermissoes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/permissoes/${paginaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPermissoes(res.data);
      } catch (err) {
        setErro("Erro ao carregar permissões.");
      }
    };

    carregarPermissoes();
  }, [paginaId, token]);

  const handleAdicionar = async () => {
    setErro("");
    setMensagem("");

    if (!email.trim()) {
      return setErro("Informe um e-mail válido.");
    }

    try {
      await axios.post(`http://localhost:5000/api/permissoes/${paginaId}`, {
        email,
        permissao: tipo,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensagem("Permissão adicionada com sucesso!");
      setEmail("");
      setTipo("editor");

      const res = await axios.get(`http://localhost:5000/api/permissoes/${paginaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissoes(res.data);
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Erro ao adicionar permissão.");
    }
  };

  const handleRemover = async (clienteId) => {
    if (!window.confirm("Deseja remover esta permissão?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/permissoes/${paginaId}/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPermissoes(permissoes.filter(p => p.clienteId !== clienteId));
    } catch (err) {
      setErro("Erro ao remover permissão.");
    }
  };

  return (
    <div className="permissoes-container">
      {/* Navbar */}
      <div className="navbar-dashboard">
        <img src={logoInfoPoint} alt="Logo InfoPoint" className="logo-navbar" />
        <button className="btn-voltar" onClick={() => navigate("/minhas-paginas")}>
          Voltar
        </button>
      </div>

      <h1 className="titulo-minhas-paginas">Gerenciar Permissões</h1>

      <div className="permissoes-card">
        <div className="form-adicionar">
          <input
            type="email"
            placeholder="E-mail do colaborador"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="editor">Editor</option>
            <option value="adm">Administrador</option>
          </select>
          <button onClick={handleAdicionar}>Adicionar</button>
        </div>

        {erro && <p className="erro">{erro}</p>}
        {mensagem && <p className="mensagem">{mensagem}</p>}

        <h3>Colaboradores com acesso:</h3>
        <ul className="lista-permissoes">
          {permissoes.length === 0 ? (
            <li>Nenhuma permissão registrada.</li>
          ) : (
            permissoes.map((p) => (
              <li key={p.clienteId}>
                <strong>{p.email}</strong> — {p.permissao}
                <button className="remover" onClick={() => handleRemover(p.clienteId)}>Remover</button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Permissoes;
