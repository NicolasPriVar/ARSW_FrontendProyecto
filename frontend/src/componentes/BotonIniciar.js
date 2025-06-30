import React from 'react';
import './BotonIniciar.css';

function BotonIniciar({ onClick }) {
    return (
        <button className="boton-iniciar" onClick={onClick}>
            Iniciar partida
        </button>
    );
}

export default BotonIniciar;
