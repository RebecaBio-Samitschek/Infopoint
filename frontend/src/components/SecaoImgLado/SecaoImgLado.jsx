import React, { useState, useRef } from "react";
import "./SecaoImgLado.css";
import imagemDefault from "../../assets/fundo.jpg";
import BarraEdicao from "../BarraEdicao";

const SecaoImgLado = ({
  dados,
  atualizarDados,
  modoVisualizacao = false
}) => {
  const modoEdicao = !modoVisualizacao;
  const [showEditor, setShowEditor] = useState(false);
  const [targetElement, setTargetElement] = useState(null);
  const fileInputRef = useRef(null);

  const {
    titulo = "Título de exemplo",
    texto = "Texto descritivo aqui...",
    imagem,
    estiloTitulo = {},
    estiloTexto = {},
    posicaoImagem = "esquerda"
  } = dados;

  const abrirEditor = (e) => {
    if (!modoEdicao) return;
    setShowEditor(true);
    setTargetElement(e.target);
  };

  const aplicarEstilo = (novoEstilo) => {
    if (!targetElement) return;
    const tag = targetElement.tagName;
    if (tag === "H2") {
      atualizarDados({ estiloTitulo: { ...estiloTitulo, ...novoEstilo } });
    } else if (tag === "P") {
      atualizarDados({ estiloTexto: { ...estiloTexto, ...novoEstilo } });
    }
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => atualizarDados({ imagem: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const renderImagem = (
    <div className="secao-imglado-img">
      <img
        src={imagem || imagemDefault}
        alt="Visual"
        onClick={() => modoEdicao && fileInputRef.current.click()}
      />
      {modoEdicao && (
        <>
          <button
            className="btn-editar-img"
            onClick={() => fileInputRef.current.click()}
            title="Editar imagem"
          >
            ✎
          </button>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
            className="input-image"
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  );

  const renderTexto = (
    <div className="secao-imglado-texto">
      <h2
        className={modoEdicao ? "ponteado-editavel" : ""}
        contentEditable={modoEdicao}
        suppressContentEditableWarning
        onBlur={(e) => atualizarDados({ titulo: e.target.innerText })}
        onClick={abrirEditor}
        style={estiloTitulo}
      >
        {titulo}
      </h2>
      <p
        className={modoEdicao ? "ponteado-editavel" : ""}
        contentEditable={modoEdicao}
        suppressContentEditableWarning
        onBlur={(e) => atualizarDados({ texto: e.target.innerText })}
        onClick={abrirEditor}
        style={estiloTexto}
      >
        {texto}
      </p>
    </div>
  );

  return (
    <div
      data-testid="secao-imglado"
      className={`secao-imglado ${modoEdicao ? "secao-edicao" : "modo-visualizacao"}`}
    >
      <div className="container-imglado">
        {posicaoImagem === "esquerda" ? (
          <>
            {renderImagem}
            {renderTexto}
          </>
        ) : (
          <>
            {renderTexto}
            {renderImagem}
          </>
        )}
      </div>

      {modoEdicao && (
        <BarraEdicao
          aplicarEstilo={aplicarEstilo}
          onFechar={() => setShowEditor(false)}
          visivel={showEditor}
        />
      )}
    </div>
  );
};

export default SecaoImgLado;
