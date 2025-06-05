import React, { useState } from "react";
import BarraEdicao from "../BarraEdicao";
import "./SecaoMapa.css";

const SecaoMapa = ({ dados, atualizarDados, modoVisualizacao = false }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [targetElement, setTargetElement] = useState(null);

  const abrirEditor = (e) => {
    if (!modoVisualizacao) {
      setShowEditor(true);
      setTargetElement(e.target);
    }
  };

  const gerarLinkMapa = (endereco) =>
    `https://www.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`;

  return (
    <div className={`secao-edicao secao-texto-imagem ${modoVisualizacao ? "modo-visualizacao" : ""}`}>
      <div className="overlay">
        <h2
          className={!modoVisualizacao ? "ponteado-editavel" : ""}
          contentEditable={!modoVisualizacao}
          suppressContentEditableWarning
          onBlur={(e) =>
            !modoVisualizacao &&
            atualizarDados({ ...dados, titulo: e.target.innerText })
          }
          onClick={abrirEditor}
        >
          {dados.titulo || "Localização da empresa"}
        </h2>

        {!modoVisualizacao && (
          <input
            type="text"
            className="input-endereco ponteado-editavel"
            placeholder="Digite o endereço..."
            value={dados.endereco || ""}
            onChange={(e) =>
              atualizarDados({
                ...dados,
                endereco: e.target.value,
                mapa: gerarLinkMapa(e.target.value),
              })
            }
          />
        )}
      </div>

      <div className="mapa-container">
        {dados.mapa ? (
          <iframe
            title="Mapa"
            src={dados.mapa}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        ) : (
          <div className="mapa-placeholder">
            Mapa será exibido aqui após inserir o endereço.
          </div>
        )}
      </div>

      {!modoVisualizacao && (
        <BarraEdicao
          aplicarEstilo={(novoEstilo) => {
            if (targetElement) Object.assign(targetElement.style, novoEstilo);
          }}
          onFechar={() => setShowEditor(false)}
          visivel={showEditor}
        />
      )}
    </div>
  );
};

export default SecaoMapa;
