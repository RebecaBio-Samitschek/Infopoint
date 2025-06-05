import React from 'react';
import './Secao2.css';
import fundoSecao2 from '../../assets/landing/secao2.png';

const Secao2 = () => {
  return (
    <section
      id="como-funciona"
      className="secao2"
      style={{ backgroundImage: `url(${fundoSecao2})` }}
    >
      <div className="secao2-conteudo">
        <p className="intro">
          O InfoPoint é como um super-herói digital: rápido, confiável e sempre pronto para informar — perfeito para escolas, clínicas, recepções, espaços públicos e qualquer lugar que precisa de comunicação clara.
        </p>

        <h3>Principais vantagens:</h3>
        <ul>
          <li><strong>Interface amigável:</strong> tão simples que até sua avó consegue usar sem ajuda.</li>
          <li><strong>Desempenho impecável:</strong> funciona como um relógio — rápido e estável, mesmo com vários acessos simultâneos.</li>
          <li><strong>Versatilidade camaleônica:</strong> adapta-se a qualquer ambiente, seja ele moderno, rústico ou institucional.</li>
          <li><strong>Design elegante:</strong> visual discreto e sofisticado que se encaixa perfeitamente em qualquer espaço.</li>
        </ul>

        <p className="final">
          Seja para sinalizar, informar ou encantar — o InfoPoint é a solução certa para elevar sua comunicação a um novo nível.
        </p>
      </div>
    </section>
  );
};

export default Secao2;
