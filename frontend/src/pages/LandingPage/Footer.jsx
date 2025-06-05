import React from 'react';
import './Footer.css';
import backgroundImage from '../../assets/landing/footer.svg';

const Footer = () => {
  return (
    <section id="footer" className="footer" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="footer-content">
        <div className="info">
          <h2>InfoPoint</h2>
          <p>Desenvolvido por: Rebeca Bio-Samitschek</p>
          <p>Email: rebs.ingrid@gmail.com</p>
          <p>Telefone: (00) 00000-0000</p>
        </div>
      </div>
    </section>
  );
};

export default Footer;
