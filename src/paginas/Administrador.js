import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BotonGenerar from '../componentes/botonGenerar';
import BotonEntrar from '../componentes/botonEntrar';
import './Administrador.css';
import BotonCantidadPreguntas from '../componentes/BotonCantidadPreguntas';

function Administrador() {
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();
    const [cantidadPreguntas, setCantidadPreguntas] = useState(5);

    const generarCodigo = async () => {
        setCargando(true);
        setError('');
        try {
            const response = await fetch('http://mentemaestra-fffra0affsaggzd4.canadacentral-01.azurewebsites.net/api/codigo/generar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            if (data.codigo) {
                setCodigo(data.codigo);
            } else {
                throw new Error(data.error || 'No se recibió un código válido');
            }
        } catch (error) {
            setError(error.message || 'Hubo un error generando el código');
        } finally {
            setCargando(false);
        }
    };

    const handleEntrar = async () => {
        if (!codigo) {
            setError('Primero debes generar un código');
            return;
        }

        if (!nombre.trim()) {
            setError('Ingresa tu nombre');
            return;
        }

        try {
            await fetch('http://mentemaestra-fffra0affsaggzd4.canadacentral-01.azurewebsites.net/api/codigo/ingresar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, nombre, rol: 'admin', cantidadPreguntas })  // <<--- AQUÍ
            });

            navigate(`/lobby/${codigo}`, {
                state: { nombre, rol: 'admin' }
            });
        } catch (error) {
            console.error('Error al entrar como admin-jugador:', error);
            setError('No se pudo ingresar a la partida');
        }
    };

    return (
        <div className="contenedor-administrador">
            <div className="administrador-panel">
                <h2>¡Hola, Administrador!</h2>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="codigo-input"
                />
                <BotonGenerar
                    texto={cargando ? "Generando..." : "Generar código"}
                    onClick={generarCodigo}
                    disabled={cargando}
                />
                <BotonCantidadPreguntas
                    seleccion={cantidadPreguntas}
                    onSeleccionar={setCantidadPreguntas}
                />
                {codigo && <p className="codigo-generado">Código generado: <strong>{codigo}</strong></p>}
                <div className="espacio" />
                <BotonEntrar
                    texto="Entrar"
                    onClick={handleEntrar}
                    disabled={!codigo || cargando}
                />
            </div>
        </div>
    );
}

export default Administrador;
