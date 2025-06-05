import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaginaCard.css";
import axios from "axios";

function PaginaCard({ pagina, onDelete }) {
  const navigate = useNavigate();
  const meuId = parseInt(localStorage.getItem("clienteId"));
  const souDono = pagina.clienteId === meuId;
  const permissao = pagina.permissao;

  const podeEditar = souDono || permissao === "editor" || permissao === "adm";
  const podeExcluir = souDono || permissao === "adm";
  const podeGerenciar = souDono || permissao === "adm";

  const gerarUrlFinal = () => {
    return `${window.location.origin}/infopoint/personalizado/${pagina.url}`;
  };

  const gerarRotaEdicao = () => `/editar/${pagina.url}`;

  const handleCopiar = () => {
    navigator.clipboard.writeText(gerarUrlFinal());
    alert("Link copiado para a área de transferência!");
  };

  const handleVisualizar = () => {
    window.open(gerarUrlFinal(), "_blank");
  };

  const handleExcluir = async () => {
    if (window.confirm("Tem certeza que deseja excluir esta página?")) {
      try {
        await axios.delete(`http://localhost:5000/api/paginas/${pagina.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        alert("Página excluída com sucesso!");
        onDelete(pagina.id);
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("Erro ao excluir página.");
      }
    }
  };

  return (
    <div className="pagina-card">
      <h2>{pagina.titulo}</h2>
      <p><strong>Layout:</strong> {pagina.layout}</p>

      <div className="pagina-card-buttons">
        <button onClick={handleCopiar}>Copiar Link</button>
        <button onClick={handleVisualizar}>Visualizar</button>
        {podeEditar && (
          <button onClick={() => navigate(gerarRotaEdicao())}>Editar</button>
        )}
        {podeGerenciar && (
          <button onClick={() => navigate(`/permissoes/${pagina.id}`)}>Permissões</button>
        )}
        {podeExcluir && (
          <button onClick={handleExcluir} className="btn-danger">Excluir</button>
        )}
      </div>
    </div>
  );
}


export default PaginaCard;
