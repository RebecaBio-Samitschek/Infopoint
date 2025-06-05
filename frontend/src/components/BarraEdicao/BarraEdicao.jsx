import React, { useEffect, useState } from "react";
import "./BarraEdicao.css";
import {
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaTimes,
  FaFont,
  FaTextHeight,
  FaPalette,
} from "react-icons/fa";

const BarraEdicao = ({ aplicarEstilo, onFechar, visivel }) => {
  const [estilosAtivos, setEstilosAtivos] = useState({
    italic: false,
    underline: false,
    textAlign: "",
  });

  const atualizarEstilosAtuais = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const element = selection.focusNode?.parentElement;
    if (!element) return;

    setEstilosAtivos({
      italic: element.style.fontStyle === "italic",
      underline: element.style.textDecoration === "underline",
      textAlign: element.style.textAlign || "",
    });
  };

  useEffect(() => {
    atualizarEstilosAtuais();
    document.addEventListener("selectionchange", atualizarEstilosAtuais);
    return () =>
      document.removeEventListener("selectionchange", atualizarEstilosAtuais);
  }, []);

  const alternarEstilo = (styleKey, value) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const element = selection.focusNode?.parentElement;
    if (!element) return;

    const atual = element.style[styleKey];
    const novoValor = atual === value ? "" : value;

    aplicarEstilo({ [styleKey]: novoValor });
    atualizarEstilosAtuais();
  };

  return (
    <div className={`painel-edicao ${visivel ? "visivel" : ""}`}>
      {/* Cor da fonte */}
      <label title="Cor da fonte">
        <FaPalette />
        <input
          type="color"
          onChange={(e) => aplicarEstilo({ color: e.target.value })}
          style={{ marginLeft: "4px" }}
        />
      </label>

      {/* Tamanho da fonte */}
      <label title="Tamanho da fonte">
        <FaTextHeight />
        <select
          onChange={(e) => aplicarEstilo({ fontSize: e.target.value })}
          defaultValue=""
        >
          <option value="">Tamanho</option>
          {[12, 14, 16, 18, 20, 24, 28, 32, 36, 42].map((size) => (
            <option key={size} value={`${size}px`}>
              {size}px
            </option>
          ))}
        </select>
      </label>

      {/* Fonte */}
      <label title="Fonte">
        <FaFont />
        <select
          onChange={(e) => aplicarEstilo({ fontFamily: e.target.value })}
          defaultValue=""
        >
          <option value="">Fonte</option>
          {["Arial", "Georgia", "Courier New", "Verdana", "Times New Roman", "Tahoma"].map(
            (font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            )
          )}
        </select>
      </label>

      {/* Estilos */}
      <button
        className={estilosAtivos.italic ? "ativo" : ""}
        onClick={() => alternarEstilo("fontStyle", "italic")}
        title="Itálico"
      >
        <FaItalic />
      </button>

      <button
        className={estilosAtivos.underline ? "ativo" : ""}
        onClick={() => alternarEstilo("textDecoration", "underline")}
        title="Sublinhado"
      >
        <FaUnderline />
      </button>

      {/* Alinhamentos */}
      <button
        className={estilosAtivos.textAlign === "left" ? "ativo" : ""}
        onClick={() => alternarEstilo("textAlign", "left")}
        title="Alinhar à esquerda"
      >
        <FaAlignLeft />
      </button>

      <button
        className={estilosAtivos.textAlign === "center" ? "ativo" : ""}
        onClick={() => alternarEstilo("textAlign", "center")}
        title="Centralizar"
      >
        <FaAlignCenter />
      </button>

      <button
        className={estilosAtivos.textAlign === "right" ? "ativo" : ""}
        onClick={() => alternarEstilo("textAlign", "right")}
        title="Alinhar à direita"
      >
        <FaAlignRight />
      </button>

      {/* Fechar */}
      <button onClick={onFechar} title="Fechar barra de edição">
        <FaTimes />
      </button>
    </div>
  );
};

export default BarraEdicao;
