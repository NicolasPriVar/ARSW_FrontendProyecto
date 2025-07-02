import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Fin.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function Fin() {
    const [width, height] = useWindowSize();
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

    const medalla = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return '';
    };

    return (
        <div className="fin-contenedor">
            <Confetti width={width} height={height} />
            <div className="fin-card">
                <h2>🎉 ¡Juego finalizado! 🎉</h2>
                <h3>Código de partida: <span className="codigo">{codigo}</span></h3>
                <h4 className="titulo-resultados">Resultados</h4>
                <ul className="lista-puntajes">
                    {puntajes.map((jugador, index) => (
                        <li key={index} className={`puntaje-item ${index < 3 ? 'top' : ''}`}>
                            <span className="medalla">{medalla(index)}</span>
                            <span className="nombre">{jugador.nombre}</span>
                            <span className="puntos">{jugador.puntaje} pts</span>
                        </li>
                    ))}
                </ul>
                <button className="boton-volver" onClick={() => navigate('/')}>
                    🔁 Volver al inicio
                </button>
            </div>
        </div>
    );
}

export default Fin;
