import React, { useState, useRef, useEffect } from "react";
import imagemDefault from "../../assets/fundo.jpg";
import BarraEdicao from "../BarraEdicao";
import "./SecaoTextoImagem.css";

const SecaoTextoImagem = ({ dados, atualizarDados, modoVisualizacao = false }) => {
  const fileInputRef = useRef(null);

  const [titulo, setTitulo] = useState(dados?.titulo || "Título acima da imagem");
  const [texto, setTexto] = useState(dados?.texto || "Texto descritivo aqui.");
  const [imagem, setImagem] = useState(dados?.imagem || imagemDefault);
  const [estiloTitulo, setEstiloTitulo] = useState(dados?.estiloTitulo || {});
  const [estiloTexto, setEstiloTexto] = useState(dados?.estiloTexto || {});
  const [showEditor, setShowEditor] = useState(false);
  const [targetElement, setTargetElement] = useState(null);

  useEffect(() => {
    setTitulo(dados?.titulo || "Título acima da imagem");
    setTexto(dados?.texto || "Texto descritivo aqui.");
    setImagem(dados?.imagem || imagemDefault);
    setEstiloTitulo(dados?.estiloTitulo || {});
    setEstiloTexto(dados?.estiloTexto || {});
  }, [dados]);

  const abrirEditor = (e) => {
    if (!modoVisualizacao) {
      setTargetElement(e.target);
      setShowEditor(true);
    }
  };

  const aplicarEstilo = (novoEstilo) => {
    if (!targetElement) return;

    if (targetElement.tagName === "H2") {
      const atualizado = { ...estiloTitulo, ...novoEstilo };
      Object.assign(targetElement.style, atualizado);
      setEstiloTitulo(atualizado);
      atualizarDados({ ...dados, estiloTitulo: atualizado });
    } else if (targetElement.tagName === "P") {
      const atualizado = { ...estiloTexto, ...novoEstilo };
      Object.assign(targetElement.style, atualizado);
      setEstiloTexto(atualizado);
      atualizarDados({ ...dados, estiloTexto: atualizado });
    }
  };

  const onChangeImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagem(reader.result);
      atualizarDados({ ...dados, imagem: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`secao-texto-imagem ${modoVisualizacao ? "secao-visualizacao" : ""}`}>
      <div className={`secao-edicao ${modoVisualizacao ? "modo-visualizacao" : ""}`}>
        <div className="overlay">
          <h2
            className={!modoVisualizacao ? "ponteado-editavel" : ""}
            style={estiloTitulo}
            contentEditable={!modoVisualizacao}
            suppressContentEditableWarning
            onClick={abrirEditor}
            onBlur={(e) => {
              setTitulo(e.target.innerText);
              atualizarDados({ ...dados, titulo: e.target.innerText });
            }}
          >
            {titulo}
          </h2>
          <p
            className={!modoVisualizacao ? "ponteado-editavel" : ""}
            style={estiloTexto}
            contentEditable={!modoVisualizacao}
            suppressContentEditableWarning
            onClick={abrirEditor}
            onBlur={(e) => {
              setTexto(e.target.innerText);
              atualizarDados({ ...dados, texto: e.target.innerText });
            }}
          >
            {texto}
          </p>
        </div>

        <div className="imagem-container">
          {!modoVisualizacao && (
            <button
              className="botao-editar-imagem"
              onClick={() => fileInputRef.current.click()}
              title="Editar imagem"
            >
              ✎
            </button>
          )}
          <img
            src={imagem && imagem !== "" ? imagem : imagemDefault}
            alt="Preview"
            className="imagem-preview"
            onClick={() => {
              if (!modoVisualizacao) fileInputRef.current.click();
            }}
          />
        </div>

        {!modoVisualizacao && (
          <>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              data-testid="input-imagem"
              style={{ display: "none" }}
              onChange={onChangeImagem}
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

export default SecaoTextoImagem;
