import React from "react";
import './botonLlamada.css';

function BotonLlamada({ conectado, onClick, className = '' }) {
    return (
        <button
            className={`btn ${conectado ? 'btn-danger' : 'btn-success'} ${className}`}
            onClick={onClick}
        >
            {conectado ? 'Salir de la llamada' : 'Unirse a la llamada'}
        </button>
    );
}

export default BotonLlamada;
