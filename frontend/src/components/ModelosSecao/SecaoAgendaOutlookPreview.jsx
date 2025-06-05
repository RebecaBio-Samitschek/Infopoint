import React from "react";
import agendaThumb from "../../assets/outlook.jpg";

const SecaoAgendaOutlookPreview = () => {
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
        <p>Outlook Agenda incorporada</p>
      </div>
      <img
        src={agendaThumb}
        alt="Preview agenda Outlook"
        className="imagem-miniatura"
        style={{ width: "100%", height: "60%", objectFit: "cover" }}
      />
    </div>
  );
};

export default SecaoAgendaOutlookPreview;
