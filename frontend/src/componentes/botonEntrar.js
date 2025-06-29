import React from 'react';
import './botonEntrar.css';

function BotonEntrar({ texto, onClick }) {
    return (
        <button className="boton-entrar" onClick={onClick}>
            {texto}
        </button>
    );
}

export default BotonEntrar;