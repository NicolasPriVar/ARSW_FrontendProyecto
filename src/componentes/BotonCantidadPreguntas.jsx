import React from 'react';
import './BotonCantidadPreguntas.css';

function BotonCantidadPreguntas({ seleccion, onSeleccionar }) {
    const opciones = [5, 10, 15, 20];

    return (
        <div className="botones-cantidad-container">
            <p>Selecciona la cantidad de preguntas:</p>
            <div className="botones-cantidad">
                {opciones.map((opcion) => (
                    <button
                        key={opcion}
                        className={`boton-cantidad ${seleccion === opcion ? 'activo' : ''}`}
                        onClick={() => onSeleccionar(opcion)}
                    >
                        {opcion}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default BotonCantidadPreguntas;