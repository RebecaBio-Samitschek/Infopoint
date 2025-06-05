import React, { useState, useRef, useEffect } from "react";
import { FaTrash, FaCopy, FaArrowUp, FaArrowDown, FaEllipsisV } from "react-icons/fa";
import "./ControlesSecao.css";

const ControlesSecao = ({ onDuplicar, onMoverCima, onMoverBaixo, onRemover }) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef(null);

  const alternarMenu = () => {
    setMostrarMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickFora = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMostrarMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  return (
    <div className="controle-wrapper" ref={menuRef}>
      <button className="btn-toggle-menu" onClick={alternarMenu} title="Mais opções">
        <FaEllipsisV />
      </button>

      {mostrarMenu && (
        <div className="botoes-secao">
          <button onClick={onMoverCima} title="Mover para cima"><FaArrowUp /></button>
          <button onClick={onMoverBaixo} title="Mover para baixo"><FaArrowDown /></button>
          <button onClick={onDuplicar} title="Duplicar seção"><FaCopy /></button>
          <button onClick={onRemover} title="Remover seção"><FaTrash /></button>
        </div>
      )}
    </div>
  );
};

export default ControlesSecao;
