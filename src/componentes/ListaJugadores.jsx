import React from 'react';
import './ListaJugadores.css'; // Asegúrate de tener este archivo para estilos

function ListaJugadores({ jugadores }) {
    return (
        <div>
            <h3>Jugadores en la sala:</h3>
            <ul className="lista-jugadores">
                {Object.entries(jugadores).map(([nombre, rol]) => (
                    <li key={nombre}>
                        {nombre} {rol === 'admin' && <span className="corona">👑</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaJugadores;
