import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ListaJugadores from '../componentes/ListaJugadores';
import './Lobby.css';
import BotonSalir from '../componentes/BotonSalir';
import BotonIniciar from '../componentes/BotonIniciar';
import { useNavigate } from 'react-router-dom';


function Lobby() {
    const { codigo } = useParams();
    const location = useLocation();
    const nombre = location.state?.nombre || 'Jugador anónimo';
    const navigate = useNavigate();
    const rol = location.state?.rol || 'jugador';

    const [jugadores, setJugadores] = useState({});
    const [partidaIniciada, setPartidaIniciada] = useState(false);

    useEffect(() => {
        const fetchJugadores = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/codigo/jugadores/${codigo}`);
                const data = await response.json();
                setJugadores(data);

                const resEstado = await fetch(`http://localhost:8080/api/codigo/estado/${codigo}`);
                const dataEstado = await resEstado.json();
                setPartidaIniciada(dataEstado.iniciada);
            } catch (error) {
                console.error("Error al obtener jugadores:", error);
            }
        };

        fetchJugadores();
        const intervalo = setInterval(fetchJugadores, 3000);
        return () => clearInterval(intervalo);
    }, [codigo]);

    const handleIniciar = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/codigo/iniciar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ codigo, nombre })
            });

            if (response.ok) {
                setPartidaIniciada(true);
                navigate(`/partida/${codigo}`, {
                    state: { nombre, rol }
                });
            } else {
                const data = await response.json();
                alert(data.error || 'Error al iniciar la partida');
            }
        } catch (error) {
            console.error("Error al iniciar partida:", error);
        }
    };

    const redirigidoRef = useRef(false);

    useEffect(() => {
        const verificarEstado = async () => {
            if (redirigidoRef.current) return;

            try {
                const res = await fetch(`http://localhost:8080/api/codigo/estado/${codigo}`);
                const data = await res.json();
                if (data.iniciada) {
                    redirigidoRef.current = true;
                    navigate(`/partida/${codigo}`, {
                        state: { nombre, rol }
                    });
                }
            } catch (error) {
                console.error('Error al verificar estado:', error);
            }
        };

        const intervalo = setInterval(verificarEstado, 2000);
        return () => clearInterval(intervalo);
    }, [codigo, nombre, rol, navigate]);

    return (
        <div className="lobby-contenedor">
            <div className="lobby-panel">
                <h2>Lobby</h2>
                <p>Estás conectado como: <strong>{nombre}</strong></p>
                <p>Código de la partida: <strong>{codigo}</strong></p>

                <ListaJugadores jugadores={jugadores} />
                {rol !== 'admin' && (
                    <BotonSalir onClick={async () => {
                        try {
                            await fetch(`http://localhost:8080/api/codigo/salir`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ codigo, nombre }),
                            });
                            window.location.href = '/';
                        } catch (error) {
                            console.error('Error al salir:', error);
                        }
                    }} />
                )}
                {rol === 'admin' && !partidaIniciada && (
                    <BotonIniciar onClick={handleIniciar} />
                )}
                <p>Esperando a más jugadores...</p>

            </div>
        </div>
    );
}

export default Lobby;
