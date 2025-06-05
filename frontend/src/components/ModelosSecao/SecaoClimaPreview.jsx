import React from "react";
import { WiDaySunny } from "react-icons/wi";

const SecaoClimaPreview = () => {
  return (
    <div className="secao-preview-conteudo" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="secao-preview-overlay" style={{ width: "100%" }}>
        <WiDaySunny size={40} style={{ marginBottom: "8px" }} />
        <h3>Clima</h3>
        <p>Exibe o clima atual da cidade</p>
      </div>
    </div>
  );
};

export default SecaoClimaPreview;
