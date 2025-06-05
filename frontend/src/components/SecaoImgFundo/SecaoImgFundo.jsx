import React, { useState, useRef, useEffect } from "react";
import "./SecaoImgFundo.css";
import imagemDefault from "../../assets/fundo.jpg";
import BarraEdicao from "../BarraEdicao";

const SecaoImgfundo = ({
  dados,
  atualizarDados,
  modoVisualizacao = false,
}) => {
  const [titulo, setTitulo] = useState(dados?.titulo || "Sua Empresa");
  const [texto, setTexto] = useState(
    dados?.texto || "Nosso lema é cuidar de você com excelência."
  );
  const [background, setBackground] = useState(dados?.background || imagemDefault);
  const [estiloTitulo, setEstiloTitulo] = useState(dados?.estiloTitulo || {});
  const [estiloTexto, setEstiloTexto] = useState(dados?.estiloTexto || {});
  const [showEditor, setShowEditor] = useState(false);
  const [targetElement, setTargetElement] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log("[SecaoImgFundo] Modo visualização:", modoVisualizacao);
    console.log("[SecaoImgFundo] Imagem recebida:", background);
  }, [modoVisualizacao, background]);

  const abrirEditor = (e) => {
    if (modoVisualizacao) return;
    setShowEditor(true);
    setTargetElement(e.target);
  };

  const aplicarEstilo = (novoEstilo) => {
    if (targetElement) {
      if (targetElement.tagName === "H2") {
        const estiloAtualizado = { ...estiloTitulo, ...novoEstilo };
        Object.assign(targetElement.style, estiloAtualizado);
        setEstiloTitulo(estiloAtualizado);
        atualizarDados({ ...dados, estiloTitulo: estiloAtualizado });
      } else if (targetElement.tagName === "P") {
        const estiloAtualizado = { ...estiloTexto, ...novoEstilo };
        Object.assign(targetElement.style, estiloAtualizado);
        setEstiloTexto(estiloAtualizado);
        atualizarDados({ ...dados, estiloTexto: estiloAtualizado });
      }
    }
  };
  

  const abrirSeletor = () => {
    fileInputRef.current.click();
  };

  const onChangeImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackground(reader.result);
        atualizarDados({ ...dados, background: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`secao-sobre ${modoVisualizacao ? "modo-visualizacao" : "secao-edicao"}`}
      style={
        modoVisualizacao
          ? { '--bg-url': `url(${background})` }
          : { backgroundImage: `url(${background})` }
      }
      data-testid="secao-img-fundo"
    >
      {!modoVisualizacao && (
        <button
          className="btn-editar-imagem"
          onClick={abrirSeletor}
          title="Editar imagem"
        >
          ✎
        </button>
      )}

      <div className="overlay">
        <h2
          contentEditable={!modoVisualizacao}
          suppressContentEditableWarning
          onBlur={(e) => {
            setTitulo(e.target.innerText);
            atualizarDados({ ...dados, titulo: e.target.innerText });
          }}
          onClick={abrirEditor}
          style={estiloTitulo}
          className={!modoVisualizacao ? "ponteado-editavel" : ""}
        >
          {titulo}
        </h2>
        <p
          contentEditable={!modoVisualizacao}
          suppressContentEditableWarning
          onBlur={(e) => {
            setTexto(e.target.innerText);
            atualizarDados({ ...dados, texto: e.target.innerText });
          }}
          onClick={abrirEditor}
          style={estiloTexto}
          className={!modoVisualizacao ? "ponteado-editavel" : ""}
        >
          {texto}
        </p>
        {!modoVisualizacao && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={onChangeImage}
              className="input-image"
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <BarraEdicao
              aplicarEstilo={aplicarEstilo}
              onFechar={() => setShowEditor(false)}
              visivel={showEditor}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SecaoImgfundo;
