import React from "react";
import imagemDefault from "../../assets/fundo.jpg";

const SecaoImgFundoPreview = () => {
  return (
    <div
      className="secao-preview-conteudo"
      style={{
        backgroundImage: `url(${imagemDefault})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "120px",
        borderRadius: "8px",
        overflow: "hidden"
      }}
    >
      <div className="secao-preview-overlay">
        <h3>Sua Empresa</h3>
        <p>Texto sobre imagem</p>
      </div>
    </div>
  );
};

export default SecaoImgFundoPreview;