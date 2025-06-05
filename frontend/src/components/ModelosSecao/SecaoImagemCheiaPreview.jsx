import React from "react";
import imagemDefault from "../../assets/fundo.jpg";

const SecaoImagemCheiaPreview = () => {
  return (
    <div
      className="secao-preview-conteudo"
      style={{
        height: "120px",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      <img
        src={imagemDefault}
        alt="Imagem Cheia"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block"
        }}
      />
    </div>
  );
};

export default SecaoImagemCheiaPreview;
