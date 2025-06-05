import React, { useState, useEffect } from 'react';
import './Secao4.css';
import passo1 from '../../assets/landing/passo1.png';
import passo2 from '../../assets/landing/passo2.png';
import passo3 from '../../assets/landing/passo3.png';
import passo4 from '../../assets/landing/passo4.png';

const passos = [
  {
    imagem: passo1,
    texto: 'Comece fazendo login ou criando uma conta personalizada.',
  },
  {
    imagem: passo2,
    texto: 'Escolha criar uma Nova Pagina para seu InfoPoint.',
  },
  {
    imagem: passo3,
    texto: 'Edite facilmente os textos e imagens em tempo real.',
  },
  {
    imagem: passo4,
    texto: 'Compartilhe o link com o mundo ou exiba em seu espaço.',
  },
];

export default function Secao4() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % passos.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const proximo = () => setIndex((index + 1) % passos.length);
  const anterior = () => setIndex((index - 1 + passos.length) % passos.length);

  return (
    <section id="como-usar" className="secao4">
      <div className="secao4-container">
        <div className="secao4-imagem">
          <img src={passos[index].imagem} alt={`Passo ${index + 1}`} />
          <span className="secao4-numero">{index + 1}</span>
          <button className="seta anterior" onClick={anterior}>&lt;</button>
          <button className="seta proxima" onClick={proximo}>&gt;</button>
        </div>

        <div className="secao4-etapas">
            {passos.map((_, i) => (
            <span key={i} className={`etapa-barra ${index === i ? 'ativa' : ''}`}></span>
           ))}
        </div>

        <div className="secao4-texto">
          <p><strong>{passos[index].texto}</strong></p>
        </div>
      </div>
    </section>
  );
}
