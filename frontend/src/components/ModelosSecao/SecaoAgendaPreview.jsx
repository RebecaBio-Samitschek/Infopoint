import React from "react";
import agendaThumb from "../../assets/agenda-preview.jpg";

const SecaoAgendaPreview = () => {
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
        <h3>Agenda</h3>
        <p>Google Agenda incorporada</p>
      </div>
      <img
        src={agendaThumb}
        alt="Preview agenda"
        className="imagem-miniatura"
        style={{ width: "100%", height: "60%", objectFit: "cover" }}
      />
    </div>
  );
};

export default SecaoAgendaPreview;
