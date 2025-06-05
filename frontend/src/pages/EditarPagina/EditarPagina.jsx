import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LayoutPersonalizado from "../LayoutPersonalizado";
import axios from "axios";

const EditarPagina = () => {
  const { url } = useParams();
  const [pagina, setPagina] = useState(null);
  const [erro, setErro] = useState(null);

  // Carregar dados da página
  useEffect(() => {
    const carregarPagina = async () => {
      try {
        const urlLimpa = url.startsWith("pagina-personalizada-")
          ? url.replace("pagina-personalizada-", "")
          : url;

        const res = await axios.get(`http://localhost:5000/api/paginas/${urlLimpa}`);
        setPagina(res.data);
      } catch (err) {
        setErro("Erro ao carregar a página.");
        console.error(err);
      }
    };

    carregarPagina();
  }, [url]);

  // Salvar no localStorage assim que a página for carregada
  useEffect(() => {
    if (pagina?.url) {
      localStorage.setItem("urlPaginaPersonalizada", pagina.url);
    }
  }, [pagina]);

  if (erro) return <div>{erro}</div>;
  if (!pagina) return <div>Carregando...</div>;

  return <LayoutPersonalizado dadosExternos={pagina.dados} url={pagina.url} />;
};

export default EditarPagina;
