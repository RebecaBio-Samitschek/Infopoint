import React, { useEffect, useState } from "react";
import BarraEdicao from "../BarraEdicao";
import "./SecaoClima.css";

const SecaoClima = ({ dados, atualizarDados, modoVisualizacao = false }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [targetElement, setTargetElement] = useState(null);
  const [infoClima, setInfoClima] = useState(null);
  const [erro, setErro] = useState(null);

  const abrirEditor = (e) => {
    if (!modoVisualizacao) {
      setShowEditor(true);
      setTargetElement(e.target);
    }
  };

  const fetchClima = async (cidade) => {
    if (!cidade) return;

    const apiKey = "8ce70573d139d965e11b7f093730baac";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      if (json.cod !== 200) {
        setErro("Cidade não encontrada.");
        setInfoClima(null);
        return;
      }

      setInfoClima(json);
      setErro(null);
    } catch (e) {
      setErro("Erro ao buscar dados.");
      setInfoClima(null);
    }
  };

  useEffect(() => {
    fetchClima(dados.cidade);
  }, [dados.cidade]);

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
          {dados.titulo || "Confira o clima da sua cidade"}
        </h2>

        {!modoVisualizacao && (
          <input
            type="text"
            className="input-cidade ponteado-editavel"
            placeholder="Digite o nome da cidade..."
            value={dados.cidade || ""}
            onChange={(e) =>
              atualizarDados({
                ...dados,
                cidade: e.target.value,
              })
            }
          />
        )}
      </div>

      <div className="clima-container">
        {erro && <div className="clima-erro">{erro}</div>}

        {!erro && infoClima && (
          <div className="clima-card">
            <h3>{infoClima.name}</h3>
            <p className="descricao">{infoClima.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${infoClima.weather[0].icon}@2x.png`}
              alt="Ícone do clima"
              className="icone-clima"
            />
            <p><strong>{Math.round(infoClima.main.temp)}°C</strong></p>
            <p>Umidade: {infoClima.main.humidity}%</p>
            <p>Vento: {Math.round(infoClima.wind.speed)} km/h</p>
          </div>
        )}

        {!infoClima && !erro && (
          <div className="clima-placeholder">
            O clima será exibido aqui após digitar a cidade.
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

export default SecaoClima;
