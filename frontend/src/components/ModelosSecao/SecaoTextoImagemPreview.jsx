import React from "react";
import imagemDefault from "../../assets/fundo.jpg";

const SecaoTextoImagemPreview = () => {
  return (
    <div
      className="secao-preview-conteudo"
      style={{
        flexDirection: "column",
        height: "120px",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex"
      }}
    >
      <div className="secao-preview-overlay" style={{ width: "100%", height: "50%" }}>
        <h3>Título</h3>
        <p>Texto acima da imagem</p>
      </div>
      <img
        src={imagemDefault}
        alt="Preview"
        className="imagem-miniatura"
        style={{ width: "100%", height: "50%", objectFit: "cover" }}
      />
    </div>
  );
};

export default SecaoTextoImagemPreview;