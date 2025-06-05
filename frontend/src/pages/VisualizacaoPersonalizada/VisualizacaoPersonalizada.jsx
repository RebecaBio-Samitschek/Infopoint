import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SecaoImgFundo from "../../components/SecaoImgFundo/SecaoImgFundo";
import SecaoTextoImagem from "../../components/SecaoTextoImagem/SecaoTextoImagem";
import SecaoImgLado from "../../components/SecaoImgLado/SecaoImgLado";
import SecaoImagemCheia from "../../components/SecaoImagemCheia/SecaoImagemCheia";
import SecaoMapa from "../../components/SecaoMapa/SecaoMapa";
import SecaoVideo from "../../components/SecaoVideo/SecaoVideo";
import SecaoAgenda from "../../components/SecaoAgenda/SecaoAgenda";
import SecaoClima from "../../components/SecaoClima/SecaoClima";
import SecaoAgendaOutlook from "../../components/SecaoAgendaOutlook/SecaoAgendaOutlook";

import "./VisualizacaoPersonalizada.css";

const VisualizacaoPersonalizada = () => {
  const [secoes, setSecoes] = useState([]);
  const [urlPagina, setUrlPagina] = useState(null);
  const [, setIndiceAtual] = useState(0);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const isPreview = window.location.pathname === "/visualizar-personalizado";

  useEffect(() => {
    const secoesSalvas = localStorage.getItem("secoesPersonalizadas");
    const urlSalva = localStorage.getItem("urlPaginaPersonalizada");

    if (secoesSalvas) setSecoes(JSON.parse(secoesSalvas));
    if (urlSalva) setUrlPagina(urlSalva);
  }, []);

  useEffect(() => {
    if (!secoes.length) return;

    const intervalo = setInterval(() => {
      setIndiceAtual((prev) => {
        const proximo = (prev + 1) % secoes.length;
        const container = containerRef.current;
        const proximaSecao = container?.children[proximo];
        if (proximaSecao) {
          proximaSecao.scrollIntoView({ behavior: "smooth" });
        }
        return proximo;
      });
    }, 5000);

    return () => clearInterval(intervalo);
  }, [secoes]);

  const renderizarSecao = (secao, index) => {
    const props = {
      key: index,
      dados: secao,
      atualizarDados: () => {},
      modoVisualizacao: true,
    };

    switch (secao.tipo) {
      case "sobre": return <SecaoImgFundo {...props} />;
      case "textoImagem": return <SecaoTextoImagem {...props} />;
      case "imgLado": return <SecaoImgLado {...props} />;
      case "imagemCheia": return <SecaoImagemCheia {...props} />;
      case "mapa": return <SecaoMapa {...props} />;
      case "video": return <SecaoVideo {...props} />;
      case "agenda": return <SecaoAgenda {...props} />;
      case "clima": return <SecaoClima {...props} />;
      case "agendaOutlook": return <SecaoAgendaOutlook {...props} />;
      default: return null;
    }
  };

  const handleVoltar = () => {
    navigate("/layout-personalizado");
  };

  const handleGerarPagina = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para gerar a página.");
      return;
    }

    const payload = {
      titulo: "Página Personalizada",
      layout: "personalizado",
      dados: secoes,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    let response;

    if (urlPagina) {
      response = await axios.put(`http://localhost:5000/api/paginas/${urlPagina}`, payload, config);
    } else {
      response = await axios.post("http://localhost:5000/api/paginas", payload, config);
    }

    alert("Página gerada com sucesso!");
    localStorage.removeItem("secoesPersonalizadas");
    localStorage.removeItem("urlPaginaPersonalizada");
    window.open(`/infopoint/personalizado/${response.data.url}`, "_blank");
    navigate("/dashboard");
  } catch (error) {
    console.error("Erro ao gerar página:", error.response?.data || error);
    alert("Erro ao gerar a página.");
  }
};


  return (
    <div className="pagina-visualizacao">
      {isPreview && (
        <header className="topo-visualizacao">
          <button className="botao-voltar" onClick={handleVoltar}>
            ⬅ Voltar e editar
          </button>
          <button className="botao-gerar" onClick={handleGerarPagina}>
            Gerar Página Final
          </button>
        </header>
      )}

      <main className="conteudo-visualizacao" ref={containerRef}>
        {secoes.map((secao, index) => renderizarSecao(secao, index))}
      </main>
    </div>
  );
};

export default VisualizacaoPersonalizada;
