import React from 'react';
import './Secao3.css';
import fundoSecao3 from '../../assets/landing/secao3.png';

const Secao3 = () => {
  return (
    <section
      id="funcionalidades"
      className="secao3"
      style={{ backgroundImage: `url(${fundoSecao3})` }}
    >
      <div className="secao3-texto paragrafo1">
        <p>
          O <strong>InfoPoint</strong> foi criado para oferecer acesso claro e direto às informações certas, no momento certo. 
          Com uma interface simples e acessível, qualquer pessoa — até mesmo sem experiência técnica — 
          consegue navegar ou atualizar os dados de forma intuitiva.
        </p>
      </div>

      <div className="secao3-texto paragrafo2">
        <p>
          A estrutura de navegação por links torna o acesso ao conteúdo fluido e dinâmico. 
          Basta um toque para abrir páginas, documentos, vídeos ou seções específicas, 
          facilitando a comunicação e melhorando a experiência dos usuários.
        </p>
      </div>

      <div className="secao3-texto paragrafo3">
        <p>
          <strong>Edição fácil pelo painel:</strong><br />
          • Sem repetições ou conteúdos duplicados<br />
          • Estrutura clara com transições suaves<br />
          • Textos ajustáveis e organizados com poucos cliques
        </p>
      </div>
    </section>
  );
};

export default Secao3;
