import React from 'react';
import './botonModo.css';

function BotonModo({ texto, onClick, color }) {
    return (
        <button className="boton-modo" onClick={onClick} style={{ backgroundColor: color }}>
            {texto}
        </button>
    );
}

export default BotonModo;