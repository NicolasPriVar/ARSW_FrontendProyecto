import React, { useEffect, useState, useCallback, useContext } from 'react';
import { CallContext } from '../CallContext';
import BotonLlamada from "../componentes/botonLlamada";
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Partida.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import LlamadaVoz from '../componentes/LlamadaVoz';

function Partida() {
    const { codigo } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const nombreJugador = location.state?.nombre || 'Jugador anónimo';
    const {
        enLlamada,
        setEnLlamada,
        setCodigo,
        setNombre,
        nombre: nombreLlamada,
        codigo: codigoLlamada
    } = useContext(CallContext);

    const [pregunta, setPregunta] = useState(null);
    const [opciones, setOpciones] = useState([]);
    const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [puntaje, setPuntaje] = useState(0);
    const [contador, setContador] = useState(15);

    const cargarPregunta = useCallback(async () => {
        try {
            const res = await fetch(`https://mentemaestra-fffra0affsaggzd4.canadacentral-01.azurewebsites.net/api/codigo/pregunta/${codigo}`);
            const data = await res.json();

            if (data.fin) {
                navigate("/fin", { state: { codigo } });
                return;
            }

            if (data.nuevaPregunta || !pregunta || data.enunciado !== pregunta.enunciado) {
                setPregunta({ enunciado: data.enunciado });
                setOpciones(data.opciones);
                setRespuestaSeleccionada(null);
                setFeedback('');
            }

            setContador(data.tiempoRestante);
        } catch (error) {
            console.error("Error cargando pregunta:", error);
        }
    }, [codigo, navigate, pregunta]);

    const handleClickLlamada = () => {
        if (!enLlamada) {
            setNombre(nombreJugador);
            setCodigo(codigo);
            setEnLlamada(true);
        } else {
            setEnLlamada(false);
        }
    };

    useEffect(() => {
        const socket = new SockJS('https://mentemaestra-fffra0affsaggzd4.canadacentral-01.azurewebsites.net/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.subscribe(`/topic/pregunta/${codigo}`, (mensaje) => {
                    const data = JSON.parse(mensaje.body);

                    if (data.fin) {
                        navigate("/fin", { state: { codigo } });
                        return;
                    }

                    setPregunta({ enunciado: data.enunciado });
                    setOpciones(data.opciones);
                    setRespuestaSeleccionada(null);
                    setFeedback('');
                    setContador(data.tiempoRestante);
                });
            },
            debug: (str) => {
                // Opcional para desarrollo
                // console.log(str);
            },
        });

        client.activate();

        cargarPregunta();

        const intervalo = setInterval(() => {
            cargarPregunta();
        }, 1000);

        return () => {
            if (client.connected) client.deactivate();
            clearInterval(intervalo);
        };
    }, [codigo, navigate, cargarPregunta]);

    const manejarRespuesta = async (opcion) => {
        if (respuestaSeleccionada) return;

        setRespuestaSeleccionada(opcion);

        try {
            const res = await fetch("https://mentemaestra-fffra0affsaggzd4.canadacentral-01.azurewebsites.net/api/codigo/respuesta", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    codigo,
                    nombre: nombreJugador,
                    respuesta: opcion.texto
                })
            });

            const data = await res.json();

            setRespuestaSeleccionada({
                ...opcion,
                correcta: data.correcta
            });

            setFeedback(data.correcta ? "✅ ¡Respuesta correcta!" : "❌ Respuesta incorrecta");
            setPuntaje(data.puntaje);
        } catch (error) {
            console.error("Error enviando respuesta:", error);
        }
    };

    if (!pregunta) {
        return (
            <div className="partida-contenedor">
                <p>Cargando pregunta...</p>
            </div>
        );
    }

    return (
        <div className="partida-contenedor">
            {/* Botón de llamada */}
            <BotonLlamada
                conectado={enLlamada}
                onClick={handleClickLlamada}
                className="boton-llamada-flotante"
            />

            {/* Componente de llamada */}
            {enLlamada && nombreLlamada && codigoLlamada && (
                <LlamadaVoz codigo={codigoLlamada} nombre={nombreLlamada} />
            )}

            {/* Información de juego */}
            <div className="encabezado">
                <h2>Código de partida: {codigo}</h2>
                <h4>Jugador: {nombreJugador}</h4>
                <p>Puntaje: {puntaje}</p>
                <p>Tiempo restante: {contador} segundos</p>
            </div>

            {/* Pregunta actual */}
            <div className="pregunta-cuadro">
                <h3>{pregunta.enunciado}</h3>
            </div>

            {/* Opciones */}
            <div className="opciones">
                {opciones.map((opcion, index) => (
                    <button
                        key={index}
                        className={`boton-opcion ${
                            respuestaSeleccionada?.texto === opcion.texto
                                ? (respuestaSeleccionada.correcta ? 'correcta' : 'incorrecta')
                                : ''
                        }`}
                        onClick={() => manejarRespuesta(opcion)}
                        disabled={!!respuestaSeleccionada}
                    >
                        {opcion.texto}
                    </button>
                ))}
            </div>

            {/* Feedback */}
            {feedback && <div className="feedback">{feedback}</div>}
        </div>
    );
}

export default Partida;
