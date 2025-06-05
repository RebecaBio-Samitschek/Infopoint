import React from "react";
import imagemMapa from "../../assets/mapa-preview.jpg";

const SecaoMapaPreview = () => {
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
      <div className="secao-preview-overlay" style={{ width: "100%", height: "40%" }}>
        <h3>Localização</h3>
        <p>Mapa interativo com endereço</p>
      </div>
      <img
        src={imagemMapa}
        alt="Preview Mapa"
        className="imagem-miniatura"
        style={{ width: "100%", height: "60%", objectFit: "cover" }}
      />
    </div>
  );
};

export default SecaoMapaPreview;
