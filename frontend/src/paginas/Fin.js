import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Fin.css';

function Fin() {
    const location = useLocation();
    const navigate = useNavigate();
    const codigo = location.state?.codigo;

    const [puntajes, setPuntajes] = useState([]);

    useEffect(() => {
        const obtenerPuntajes = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/codigo/puntajes/${codigo}`);
                const data = await res.json();

                const ordenados = Object.entries(data)
                    .map(([nombre, puntaje]) => ({ nombre, puntaje }))
                    .sort((a, b) => b.puntaje - a.puntaje);

                setPuntajes(ordenados);
            } catch (err) {
                console.error('Error al obtener puntajes:', err);
            }
        };

        if (codigo) {
            obtenerPuntajes();
        }
    }, [codigo]);

    return (
        <div className="fin-contenedor">
            <h2>Juego finalizado</h2>
            <h3>Código de partida: {codigo}</h3>
            <h4>Resultados:</h4>
            <ul className="lista-puntajes">
                {puntajes.map((jugador, index) => (
                    <li key={index}>
                        {index + 1}. <strong>{jugador.nombre}</strong>: {jugador.puntaje} puntos
                    </li>
                ))}
            </ul>

            <button onClick={() => navigate('/')}>Volver al inicio</button>
        </div>
    );
}

export default Fin;
