import React from 'react';
import './LandingPage.css';
import videoBg from '../../assets/landing/video-pt.mp4';
import logo from '../../assets/landing/logo-infopoint.png';
import Secao2 from './Secao2';
import Secao3 from './Secao3';
import Secao4 from './Secao4';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="landing-wrapper">
      {/* NAVBAR */}
      <nav className="navbar-custom">
        <img src={logo} alt="Logo InfoPoint" className="logo" />

        <ul className="nav-menu">
          <li><a href="#inicio">Início</a></li>
          <li><a href="#como-funciona">Como Funciona</a></li>
          <li><a href="#funcionalidades">Funcionalidades</a></li>
          <li><a href="#como-usar">Como usar</a></li>
          <li><a href="#footer">Contato</a></li>
        </ul>

        <div className="nav-buttons">
          <a href="/login" className="btn-link">Entrar</a>
          <a href="/cadastro" className="btn-primary">Cadastrar</a>
        </div>
      </nav>

      {/* HERO COM VÍDEO DE FUNDO */}
      <section id="inicio" className="hero-section-custom">
        <video
          className="background-video"
          src={videoBg}
          autoPlay
          loop
          muted
          playsInline
        />
      </section>

      {/* SEÇÕES */}
      <Secao2 />
      <Secao3 />
      <Secao4 />
      <Footer />
    </div>
  );
};

export default LandingPage;
