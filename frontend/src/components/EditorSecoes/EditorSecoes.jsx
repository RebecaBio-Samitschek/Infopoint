import React, { useState } from "react";
import SecaoImgFundo from "../SecaoImgFundo/SecaoImgFundo";
import SecaoTextoImagem from "../SecaoTextoImagem/SecaoTextoImagem";
import SecaoImgLado from "../SecaoImgLado/SecaoImgLado";
import SecaoImagemCheia from "../SecaoImagemCheia/SecaoImagemCheia";
import SecaoMapa from "../SecaoMapa/SecaoMapa";
import SecaoVideo from "../SecaoVideo/SecaoVideo";
import SecaoAgenda from "../SecaoAgenda/SecaoAgenda";
import SecaoClima from "../SecaoClima/SecaoClima";
import SecaoAgendaOutlook from "../SecaoAgendaOutlook/SecaoAgendaOutlook";
import ControlesSecao from "../ControlesSecao/ControlesSecao";
import ModalConfirmacao from "../ModalConfirmacao/ModalConfirmacao";
import "../ControlesSecao/ControlesSecao.css";

const EditorSecoes = ({
  secoes,
  setSecoes,
  atualizarSecao,
  duplicarSecao,
  moverSecao,
  destacarTemporariamente,
  indiceDestacado,
  refsSecoes
}) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [indiceParaExcluir, setIndiceParaExcluir] = useState(null);

  const abrirModalExcluir = (index) => {
    setIndiceParaExcluir(index);
    setModalVisivel(true);
  };

  const confirmarExclusao = () => {
    if (indiceParaExcluir !== null) {
      setSecoes((prev) => prev.filter((_, i) => i !== indiceParaExcluir));
      setModalVisivel(false);
      setIndiceParaExcluir(null);
    }
  };

  const cancelarExclusao = () => {
    setModalVisivel(false);
    setIndiceParaExcluir(null);
  };

  return (
    <>
      {secoes.map((secao, index) => {
        const propsComuns = {
          titulo: secao.titulo,
          texto: secao.texto,
          estiloTitulo: secao.estiloTitulo,
          estiloTexto: secao.estiloTexto,
          onChangeTitulo: (val) => atualizarSecao(index, "titulo", val),
          onChangeTexto: (val) => atualizarSecao(index, "texto", val),
          onChangeEstiloTitulo: (novo) =>
            atualizarSecao(index, "estiloTitulo", {
              ...secao.estiloTitulo,
              ...novo,
            }),
          onChangeEstiloTexto: (novo) =>
            atualizarSecao(index, "estiloTexto", {
              ...secao.estiloTexto,
              ...novo,
            }),
        };

        const renderizarComponente = () => {
          const atualizarDados = (novosDados) => {
            const novaSecoes = [...secoes];
            novaSecoes[index] = { ...novaSecoes[index], ...novosDados };
            setSecoes(novaSecoes);
          };

          switch (secao.tipo) {
            case "sobre": return <SecaoImgFundo dados={secao} atualizarDados={atualizarDados} />;
            case "textoImagem": return <SecaoTextoImagem dados={secao} atualizarDados={atualizarDados} />;
            case "imgLado": return <SecaoImgLado dados={secao} atualizarDados={atualizarDados} />;
            case "imagemCheia": return <SecaoImagemCheia dados={secao} atualizarDados={atualizarDados} />;
            case "mapa": return <SecaoMapa dados={secao} atualizarDados={atualizarDados} />;
            case "video": return <SecaoVideo dados={secao} atualizarDados={atualizarDados} />;
            case "agenda": return <SecaoAgenda dados={secao} atualizarDados={atualizarDados} />;
            case "clima": return <SecaoClima dados={secao} atualizarDados={atualizarDados} />;
            case "agendaOutlook": return <SecaoAgendaOutlook dados={secao} atualizarDados={atualizarDados} />;
            default: return null;
          }
        };

        return (
          <div
            key={secao.id}
            ref={(el) => (refsSecoes.current[secao.id] = el)}
            className={`secao-container ${indiceDestacado === index ? "destacar" : ""}`}
            style={{ position: "relative" }}
          >
            {/* Input do nome da seção */}
            <input
              className="input-nome-secao"
              type="text"
              placeholder="Nome da seção"
              value={secao.nome || ""}
              onChange={(e) => atualizarSecao(index, "nome", e.target.value)}
            />

            {renderizarComponente()}

            <ControlesSecao
              onMoverCima={() => moverSecao(index, "up")}
              onMoverBaixo={() => moverSecao(index, "down")}
              onDuplicar={() => duplicarSecao(index)}
              onRemover={() => abrirModalExcluir(index)}
            />
          </div>
        );
      })}

      <ModalConfirmacao
        visivel={modalVisivel}
        onConfirmar={confirmarExclusao}
        onCancelar={cancelarExclusao}
      />
    </>
  );
};

export default EditorSecoes;
