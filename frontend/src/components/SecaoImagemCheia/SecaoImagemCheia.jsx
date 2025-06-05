import React, { useRef } from "react";
import "./SecaoImagemCheia.css";
import imagemDefault from "../../assets/fundo.jpg";

const SecaoImagemCheia = ({ dados, atualizarDados, onDelete, modoVisualizacao = false }) => {
  const { imagem } = dados || {};
  const fileInputRef = useRef();

  const abrirSeletor = () => {
    fileInputRef.current.click();
  };

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        atualizarDados?.({ imagem: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`secao-imagem-cheia ${modoVisualizacao ? "modo-visualizacao" : "secao-edicao"}`}
      style={
        modoVisualizacao
          ? { "--bg-url": `url(${imagem || imagemDefault})` }
          : { backgroundImage: `url(${imagem || imagemDefault})` }
      }
    >
      {!modoVisualizacao && (
        <>
          <button className="btn-editar-imagem" onClick={abrirSeletor} title="Editar imagem">
            ✎
          </button>

          {onDelete && (
            <button className="btn-remover" onClick={onDelete}>
              ✖
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImagemChange}
            ref={fileInputRef}
            style={{ display: "none" }}
            data-testid="input-imagem"
          />
        </>
      )}
    </div>
  );
};

export default SecaoImagemCheia;
