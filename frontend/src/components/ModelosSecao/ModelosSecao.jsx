import React from "react";
import SecaoImgFundoPreview from "./SecaoImgFundoPreview";
import SecaoTextoImagemPreview from "./SecaoTextoImagemPreview";
import SecaoImgLadoPreviewEsquerda from "./SecaoImgLadoPreviewEsquerda";
import SecaoImgLadoPreviewDireita from "./SecaoImgLadoPreviewDireita";
import SecaoImagemCheiaPreview from "./SecaoImagemCheiaPreview";
import SecaoMapaPreview from "./SecaoMapaPreview";
import SecaoVideoPreview from "./SecaoVideoPreview";
import SecaoAgendaPreview from "./SecaoAgendaPreview";
import SecaoClimaPreview from "./SecaoClimaPreview";
import SecaoAgendaOutlookPreview from "./SecaoAgendaOutlookPreview";

import "./ModelosSecao.css";

const ModelosSecao = ({ onAdicionarSecao }) => {
  return (
    <div className="modelos-secao">
      <h3>Modelos de Seção</h3>

      <div className="card-modelo" onClick={() => onAdicionarSecao("sobre")}>
        <SecaoImgFundoPreview />
        <p>Imagem de fundo com texto</p>
      </div>

      <div className="card-modelo" onClick={() => onAdicionarSecao("textoImagem")}>
        <SecaoTextoImagemPreview />
        <p>Texto em cima, imagem embaixo</p>
      </div>

      <div className="card-modelo" onClick={() => onAdicionarSecao("imgLadoEsquerda")}>
        <SecaoImgLadoPreviewEsquerda />
        <p>Imagem à esquerda, texto à direita</p>
      </div>

      <div className="card-modelo" onClick={() => onAdicionarSecao("imgLadoDireita")}>
        <SecaoImgLadoPreviewDireita />
        <p>Texto à esquerda, imagem à direita</p>
      </div>

      <div className="card-modelo" onClick={() => onAdicionarSecao("imagemCheia")}>
        <SecaoImagemCheiaPreview />
        <p>Imagem ocupando toda a tela</p>
      </div>

      <div className="card-modelo" onClick={() => onAdicionarSecao("mapa")}>
        <SecaoMapaPreview />
        <p>Mapa interativo com endereço</p>
      </div>

      <div className="card-modelo" onClick={() => onAdicionarSecao("video")}>
        <SecaoVideoPreview />
        <p>Texto em cima, vídeo embaixo</p>
      </div>

      <div className="card-modelo" onClick={() => onAdicionarSecao("agenda")}>
  ^     <SecaoAgendaPreview />
        <p>Google Agenda incorporada</p>
      </div>

      <div className="card-modelo" onClick={() => onAdicionarSecao("clima")}>
        <SecaoClimaPreview />
        <p>Clima atual da cidade</p>
      </div>

      <div className="card-modelo" onClick={() => onAdicionarSecao("agendaOutlook")}>
        <SecaoAgendaOutlookPreview />
        <p>Outlook Agenda incorporada</p>
      </div>
    </div>
  );
};

export default ModelosSecao;
