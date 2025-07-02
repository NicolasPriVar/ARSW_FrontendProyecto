import React, { useEffect, useState, useCallback } from 'react'; // Añade useCallback aquí
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Partida.css';

function Partida() {
    const { codigo } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const nombre = location.state?.nombre || 'Jugador anónimo';

    const [pregunta, setPregunta] = useState(null);
    const [opciones, setOpciones] = useState([]);
    const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [puntaje, setPuntaje] = useState(0);
    const [contador, setContador] = useState(15);

    const cargarPregunta = useCallback(async () => {
        const res = await fetch(`http://localhost:8080/api/codigo/pregunta/${codigo}`);
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
    }, [codigo, navigate, pregunta]);

    useEffect(() => {
        cargarPregunta();

        const intervalo = setInterval(() => {
            cargarPregunta();
        }, 1000);

        return () => clearInterval(intervalo);
    }, [cargarPregunta]);

    const manejarRespuesta = async (opcion) => {
        if (respuestaSeleccionada) return;

        setRespuestaSeleccionada(opcion);

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

        setRespuestaSeleccionada({
            ...opcion,
            correcta: data.correcta
        });

        setFeedback(data.correcta ? "✅ ¡Respuesta correcta!" : "❌ Respuesta incorrecta");
        setPuntaje(data.puntaje);
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

            {feedback && <div className="feedback">{feedback}</div>}
        </div>
    );
}

export default Partida;