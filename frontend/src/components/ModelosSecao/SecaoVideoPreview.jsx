import React from "react";
import videoThumb from "../../assets/video-preview.jpg";

const SecaoVideoPreview = () => {
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
        <h3>Vídeo</h3>
        <p>Texto em cima, vídeo embaixo</p>
      </div>
      <img
        src={videoThumb}
        alt="Preview vídeo"
        className="imagem-miniatura"
        style={{ width: "100%", height: "60%", objectFit: "cover" }}
      />
    </div>
  );
};

export default SecaoVideoPreview;
