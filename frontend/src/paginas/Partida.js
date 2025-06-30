import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Partida.css';

function Partida() {
    const { codigo } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const nombre = location.state?.nombre || 'Jugador anónimo';

    const [pregunta, setPregunta] = useState(null);
    const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [puntaje, setPuntaje] = useState(0);
    const [contador, setContador] = useState(15);
    const [finJuego, setFinJuego] = useState(false);

    const obtenerPregunta = async () => {
        const res = await fetch(`http://localhost:8080/api/codigo/pregunta/${codigo}`);
        const data = await res.json();

        if (data.fin) {
            setFinJuego(true);
            navigate("/fin");
        } else {
            setPregunta(data);
            setRespuestaSeleccionada(null);
            setContador(15);
        }
    };

    useEffect(() => {
        obtenerPregunta();
    }, [codigo]);

    useEffect(() => {
        if (finJuego || respuestaSeleccionada) return;

        const intervalo = setInterval(() => {
            setContador(prev => {
                if (prev === 1) {
                    clearInterval(intervalo);
                    fetch(`http://localhost:8080/api/codigo/pregunta/avanzar/${codigo}`, {
                        method: "POST"
                    })
                        .then(res => res.json())
                        .then(data => {
                            if (data.fin) {
                                navigate("/fin", {
                                    state: { codigo }
                                });
                            } else {
                                obtenerPregunta();
                            }
                        });
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalo);
    }, [contador, respuestaSeleccionada, finJuego]);

    const manejarRespuesta = async (opcion) => {
        setRespuestaSeleccionada(opcion);
        setFeedback(opcion.correcta ? "✅ ¡Correcto!" : "❌ Incorrecto");

        const res = await fetch("http://localhost:8080/api/codigo/respuesta", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                codigo,
                nombre,
                respuesta: opcion.texto
            })
        });

        const data = await res.json();
        setPuntaje(data.puntaje);
    };

    if (!pregunta) return <div className="partida-contenedor"><p>Cargando pregunta...</p></div>;

    return (
        <div className="partida-contenedor">
            <div className="encabezado">
                <h2>Código de partida: {codigo}</h2>
                <h4>Jugador: {nombre}</h4>
                <p>Puntaje: {puntaje}</p>
                <p>Tiempo restante: {contador} segundos</p>
            </div>

            <div className="pregunta-cuadro">
                <h3>{pregunta.enunciado}</h3>
            </div>

            <div className="opciones">
                {pregunta.opciones.map((opcion, index) => (
                    <button
                        key={index}
                        className={`boton-opcion ${respuestaSeleccionada?.texto === opcion.texto ? 'seleccionada' : ''}`}
                        onClick={() => manejarRespuesta(opcion)}
                        disabled={!!respuestaSeleccionada}
                    >
                        {opcion.texto}
                    </button>
                ))}
            </div>

            {feedback && <p className="feedback">{feedback}</p>}
        </div>
    );
}

export default Partida;
