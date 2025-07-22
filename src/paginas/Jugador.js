import React, { useState } from 'react';
import './Jugador.css';
import { useNavigate } from 'react-router-dom';
import BotonEntrar from '../componentes/botonEntrar';

function Jugador() {
    const [codigo, setCodigo] = useState('');
    const [nombre, setNombre] = useState('');
    const [mensajeError, setMensajeError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleChangeCodigo = (e) => {
        const valor = e.target.value;
        if (/^\d{0,6}$/.test(valor)) {
            setCodigo(valor);
            if (mensajeError) setMensajeError('');
        }
    };

    const handleChangeNombre = (e) => {
        setNombre(e.target.value);
        if (mensajeError) setMensajeError('');
    };

    const handleEntrar = async () => {
        if (!nombre.trim()) {
            setMensajeError("Ingresa tu nombre");
            return;
        }

        if (codigo.length !== 6) {
            setMensajeError("El código debe tener 6 dígitos");
            return;
        }

        setCargando(true);
        setMensajeError('');

        try {
            const response = await fetch('http://mentemaestra-fffra0affsaggzd4.canadacentral-01.azurewebsites.net/api/codigo/ingresar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ codigo, nombre })
            });

            const data = await response.json();

            if (response.ok) {
                navigate(`/lobby/${codigo}`, {
                    state: { nombre, rol:'jugador' }
                });
            } else {
                setMensajeError(data.error || 'Código inválido o nombre en uso');
            }
        } catch (error) {
            setMensajeError('Error al conectar con el servidor');
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="contenedor-jugador">
            <div className="panel">
                <h2>Ingresa a la partida</h2>
                <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={handleChangeNombre}
                    className="codigo-input"
                />
                <input
                    type="text"
                    placeholder="Código de 6 dígitos"
                    value={codigo}
                    onChange={handleChangeCodigo}
                    className="codigo-input"
                    maxLength="6"
                />
                {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
                <BotonEntrar
                    texto={cargando ? "Verificando..." : "Entrar"}
                    onClick={handleEntrar}
                    disabled={cargando}
                />
            </div>
        </div>
    );
}

export default Jugador;
