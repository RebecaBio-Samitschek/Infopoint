import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
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

import "./PaginaFinalPersonalizada.css";

const PaginaFinalPersonalizada = () => {
  const { url } = useParams();
  const [secoes, setSecoes] = useState([]);
  const [erro, setErro] = useState(null);
  const [pauseScroll, setPauseScroll] = useState(false);
  const containerRef = useRef(null);
  const [, setIndiceAtual] = useState(0);

  // Buscar dados da página
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/paginas/${url}`);
        setSecoes(response.data.dados);
      } catch (err) {
        console.error("Erro ao buscar página personalizada:", err);
        setErro("Página não encontrada ou erro ao carregar.");
      }
    };
    buscarDados();
  }, [url]);

  // Pausar scroll ao clicar/tocar
  useEffect(() => {
    const pausar = () => {
      setPauseScroll(true);
      setTimeout(() => setPauseScroll(false), 15000); // pausa por 15s
    };

    window.addEventListener("touchstart", pausar);
    window.addEventListener("mousedown", pausar);

    return () => {
      window.removeEventListener("touchstart", pausar);
      window.removeEventListener("mousedown", pausar);
    };
  }, []);

  // Scroll automático entre seções
  useEffect(() => {
    if (!secoes.length) return;

    const intervalo = setInterval(() => {
      if (!pauseScroll) {
        setIndiceAtual((prev) => {
          const proximo = (prev + 1) % secoes.length;
          const container = containerRef.current;
          const proximaSecao = container?.children[proximo];
          if (proximaSecao) {
            proximaSecao.scrollIntoView({ behavior: "smooth" });
          }
          return proximo;
        });
      }
    }, 5000);

    return () => clearInterval(intervalo);
  }, [secoes, pauseScroll]);

  const scrollToSecao = (index) => {
    const container = containerRef.current;
    const secao = container?.children[index];
    if (secao) {
      secao.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  if (erro) return <div className="erro-pagina">{erro}</div>;
  if (!secoes.length) return <div className="carregando">Carregando página...</div>;

  return (
  <>
    {pauseScroll && (
      <aside className="menu-lateral-scroll">
        {secoes.map((secao, index) => (
          <button key={index} onClick={() => scrollToSecao(index)}>
            {secao.nome?.substring(0, 20) || secao.titulo?.substring(0, 20) || `Seção ${index + 1}`}
          </button>
        ))}
      </aside>
    )}

    <div className="pagina-personalizada" ref={containerRef}>
      {secoes.map((secao, index) => renderizarSecao(secao, index))}
    </div>
  </>
);

};

export default PaginaFinalPersonalizada;
