import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EditorSecoes from "../../components/EditorSecoes/EditorSecoes";
import ModelosSecao from "../../components/ModelosSecao/ModelosSecao";
import ModalConfirmacao from "../../components/ModalConfirmacao/ModalConfirmacao";
import "./LayoutPersonalizado.css";

const gerarId = () => Math.random().toString(36).substr(2, 9);

const LayoutPersonalizado = ({ dadosExternos, url: urlProp }) => {
  const [secoes, setSecoes] = useState([]);
  const [indiceDestacado, setIndiceDestacado] = useState(null);
  const [modalVoltarVisivel, setModalVoltarVisivel] = useState(false);
  const refsSecoes = useRef({});
  const navigate = useNavigate();
  const params = useParams();
  const url = urlProp || params.url;

  useEffect(() => {
    if (dadosExternos) {
      if (Array.isArray(dadosExternos)) {
        setSecoes(dadosExternos);
      } else if (dadosExternos.secoes) {
        setSecoes(dadosExternos.secoes);
      }
    }
  }, [dadosExternos]);

  useEffect(() => {
    if (!url && !dadosExternos) {
      const secoesSalvas = localStorage.getItem("secoesPersonalizadas");
      if (secoesSalvas) {
        setSecoes(JSON.parse(secoesSalvas));
      }
    }
  }, [url, dadosExternos]);

  const handleVoltar = () => {
    if (secoes.length > 0) {
      setModalVoltarVisivel(true);
    } else {
      navigate("/dashboard");
    }
  };

  const confirmarSaida = () => {
    localStorage.removeItem("secoesPersonalizadas");
    setModalVoltarVisivel(false);
    navigate("/dashboard");
  };

  const cancelarSaida = () => setModalVoltarVisivel(false);

  const destacarTemporariamente = (index) => {
    setIndiceDestacado(index);
    setTimeout(() => setIndiceDestacado(null), 500);
  };

  const rolarParaSecao = (id) => {
    const el = refsSecoes.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const visualizarPagina = () => {
    localStorage.setItem("secoesPersonalizadas", JSON.stringify(secoes));
    navigate("/visualizar-personalizado");
  };

  const adicionarSecao = (tipo) => {
    let novaSecao = null;
    const imagemPadrao = require("../../assets/fundo.jpg");

    switch (tipo) {
      case "sobre":
        novaSecao = {
          id: gerarId(),
          tipo,
          nome: "Nova Seção", 
          titulo: "Sua Empresa",
          texto: "Nosso lema é cuidar de você com excelência.",
          background: imagemPadrao,
          estiloTitulo: {},
          estiloTexto: {},
        };
        break;
      case "textoImagem":
        novaSecao = {
          id: gerarId(),
          tipo,
          nome: "Nova Seção", 
          titulo: "Título acima da imagem",
          texto: "Texto descritivo aqui.",
          imagem: null,
          estiloTitulo: {},
          estiloTexto: {},
        };
        break;
      case "imgLadoEsquerda":
        novaSecao = {
          id: gerarId(),
          tipo: "imgLado",
          nome: "Nova Seção", 
          titulo: "Título com imagem à esquerda",
          texto: "Texto ao lado direito da imagem.",
          imagem: imagemPadrao,
          estiloTitulo: {},
          estiloTexto: {},
          posicaoImagem: "esquerda",
        };
        break;
      case "imgLadoDireita":
        novaSecao = {
          id: gerarId(),
          tipo: "imgLado",
          nome: "Nova Seção", 
          titulo: "Título com imagem à direita",
          texto: "Texto ao lado esquerdo da imagem.",
          imagem: imagemPadrao,
          estiloTitulo: {},
          estiloTexto: {},
          posicaoImagem: "direita",
        };
        break;
      case "imagemCheia":
        novaSecao = { id: gerarId(), tipo, nome: "Nova Seção",  imagem: imagemPadrao };
        break;
      case "mapa":
        novaSecao = {
          id: gerarId(),
          tipo,
          nome: "Nova Seção", 
          titulo: "Localização da empresa",
          endereco: "",
          mapa: "",
        };
        break;
      case "video":
        novaSecao = {
          id: gerarId(),
          tipo,
          nome: "Nova Seção", 
          titulo: "Assista ao nosso vídeo",
          link: "",
          embed: "",
        };
        break;
      case "agenda":
        novaSecao = {
          id: gerarId(),
          tipo,
          nome: "Nova Seção", 
          titulo: "Confira nossa agenda",
          link: "",
        };
        break;
      case "clima":
        novaSecao = {
          id: gerarId(),
          tipo,
          nome: "Nova Seção", 
          titulo: "Confira o clima da sua cidade",
          cidade: "",
          dados: null,
        };
        break;
      case "agendaOutlook":
        novaSecao = {
          id: gerarId(),
          tipo,
          nome: "Nova Seção", 
          titulo: "Confira nossa agenda no Outlook",
          link: "",
        };
        break;
      default:
        break;
    }

    if (novaSecao) {
      setSecoes((prev) => [...prev, novaSecao]);
      setTimeout(() => {
        destacarTemporariamente(secoes.length);
        rolarParaSecao(novaSecao.id);
      }, 50);
    }
  };

  const atualizarSecao = (index, campo, valor) => {
    const novasSecoes = [...secoes];
    novasSecoes[index][campo] = valor;
    setSecoes(novasSecoes);
  };

  const duplicarSecao = (index) => {
    const secaoOriginal = secoes[index];
    const novaSecao = {
      ...JSON.parse(JSON.stringify(secaoOriginal)),
      id: gerarId(),
    };
    setSecoes((prev) => {
      const novas = [...prev];
      novas.splice(index + 1, 0, novaSecao);
      return novas;
    });
    destacarTemporariamente(index + 1);
    setTimeout(() => rolarParaSecao(novaSecao.id), 50);
  };

  const moverSecao = (index, direcao) => {
    setSecoes((prevSecoes) => {
      const novasSecoes = [...prevSecoes];
      if (direcao === "up" && index > 0) {
        [novasSecoes[index - 1], novasSecoes[index]] = [
          novasSecoes[index],
          novasSecoes[index - 1],
        ];
        destacarTemporariamente(index - 1);
        setTimeout(() => rolarParaSecao(novasSecoes[index - 1].id), 50);
      } else if (direcao === "down" && index < novasSecoes.length - 1) {
        [novasSecoes[index + 1], novasSecoes[index]] = [
          novasSecoes[index],
          novasSecoes[index + 1],
        ];
        destacarTemporariamente(index + 1);
        setTimeout(() => rolarParaSecao(novasSecoes[index + 1].id), 50);
      }
      return novasSecoes.map((secao) => ({ ...secao }));
    });
  };

  return (
    <div className="layout-personalizado">
      <aside className="menu-lateral">
        <ModelosSecao onAdicionarSecao={adicionarSecao} />
      </aside>

      <main className="conteudo">
        <div style={{ padding: "16px", display: "flex", justifyContent: "space-between" }}>
          <button onClick={handleVoltar} className="back-button">
            ⬅ Voltar
          </button>

          <div>
            <button onClick={visualizarPagina} className="generate-button">
              👁 Visualizar Página
            </button>
          </div>
        </div>

        <EditorSecoes
          secoes={secoes}
          setSecoes={setSecoes}
          atualizarSecao={atualizarSecao}
          duplicarSecao={duplicarSecao}
          moverSecao={moverSecao}
          destacarTemporariamente={destacarTemporariamente}
          indiceDestacado={indiceDestacado}
          refsSecoes={refsSecoes}
        />

        <ModalConfirmacao
          visivel={modalVoltarVisivel}
          titulo="Deseja sair da edição?"
          mensagem="Você perderá todas as alterações feitas nesta página."
          onConfirmar={confirmarSaida}
          onCancelar={cancelarSaida}
        />
      </main>
    </div>
  );
};

export default LayoutPersonalizado;
