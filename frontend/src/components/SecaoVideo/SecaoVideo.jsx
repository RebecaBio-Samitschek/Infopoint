import React, { useState } from "react";
import BarraEdicao from "../BarraEdicao";
import "./SecaoVideo.css";

const SecaoVideo = ({ dados, atualizarDados, modoVisualizacao = false }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [targetElement, setTargetElement] = useState(null);

  const abrirEditor = (e) => {
    if (!modoVisualizacao) {
      setShowEditor(true);
      setTargetElement(e.target);
    }
  };

  const extrairEmbedUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

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
          {dados.titulo || "Assista ao nosso vídeo"}
        </h2>

        {!modoVisualizacao && (
          <input
            type="text"
            className="input-video ponteado-editavel"
            placeholder="Cole o link do YouTube aqui..."
            value={dados.link || ""}
            onChange={(e) =>
              atualizarDados({
                ...dados,
                link: e.target.value,
                embed: extrairEmbedUrl(e.target.value),
              })
            }
          />
        )}
      </div>

      <div className="video-container">
        {dados.embed ? (
          <iframe
            title="Vídeo institucional"
            src={dados.embed}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="video-placeholder">
            O vídeo será exibido aqui após colar o link do YouTube.
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

export default SecaoVideo;
