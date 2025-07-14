import React from 'react';
import './botonGenerar.css';

function BotonGenerar({texto, onClick}) {
    return (
        <button className="boton-generar" onClick={onClick}>
            {texto}
        </button>
    )
}
export default BotonGenerar;