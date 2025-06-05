import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PaginaCard from "../../components/PaginaCard";
import logoInfoPoint from "../../assets/landing/logo-infopoint.png";
import "./MinhasPaginas.css";

function MinhasPaginas() {
  const [paginas, setPaginas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5000/api/paginas/cliente", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setPaginas(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar páginas:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Sessão expirada. Faça login novamente.");
          localStorage.clear();
          navigate("/login");
        }
      });
  }, [navigate]);

  const handleDeletePagina = (id) => {
    setPaginas((prev) => prev.filter((p) => p.id !== id));
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="minhas-paginas-container">
      {/* Navbar com logo e botão de voltar */}
      <div className="navbar-dashboard">
        <img src={logoInfoPoint} alt="Logo InfoPoint" className="logo-navbar" />
        <button className="btn-voltar" onClick={handleBackToDashboard}>
          Voltar para o Dashboard
        </button>
      </div>

      {/* Título centralizado */}
      <h1 className="titulo-minhas-paginas">Minhas Páginas InfoPoint</h1>

      {/* Lista de páginas */}
      <div className="paginas-lista">
        {paginas.length === 0 ? (
          <p className="mensagem-vazia">Você ainda não criou nenhuma página.</p>
        ) : (
          paginas.map((pagina) => (
            <PaginaCard
              key={pagina.id}
              pagina={pagina}
              onDelete={handleDeletePagina}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default MinhasPaginas;
