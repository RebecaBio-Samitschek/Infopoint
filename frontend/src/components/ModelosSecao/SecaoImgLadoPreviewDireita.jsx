import React from "react";
import imagemDefault from "../../assets/fundo.jpg";

const SecaoImgLadoPreviewDireita = () => {
  return (
    <div className="secao-preview-conteudo">
      <div className="secao-preview-overlay">
        <h3>Sua Mensagem</h3>
        <p>Imagem à direita</p>
      </div>
      <img src={imagemDefault} alt="preview" className="imagem-miniatura" />
    </div>
  );
};

export default SecaoImgLadoPreviewDireita;
