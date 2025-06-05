import React from "react";
import imagemDefault from "../../assets/fundo.jpg";

const SecaoImgLadoPreviewEsquerda = () => {
  return (
    <div className="secao-preview-conteudo">
      <img src={imagemDefault} alt="preview" className="imagem-miniatura" />
      <div className="secao-preview-overlay">
        <h3>Sua Mensagem</h3>
        <p>Imagem à esquerda</p>
      </div>
    </div>
  );
};

export default SecaoImgLadoPreviewEsquerda;
