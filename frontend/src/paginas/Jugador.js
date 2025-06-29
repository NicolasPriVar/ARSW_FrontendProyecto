import React, { useState } from 'react';
import './Jugador.css'
import BotonEntrar from '../componentes/botonEntrar';

function Jugador() {
    const [codigo, setCodigo] = useState('');

    const handleChange = (e) => {
        const valor = e.target.value;
        if (/^\d{0,6}$/.test(valor)) {
            setCodigo(valor);
        }
    };

    const handleEntrar = () => {
        if (codigo.length !== 6) {
            alert("El código debe tener 6 dígitos");
        } else {
            alert(`Entrando con código: ${codigo}`);
        }
    };

    return (
        <div className="contenedor-jugador">
            <div className="panel">
                <h2>Ingresa el código</h2>
                <input
                    type="text"
                    value={codigo}
                    onChange={handleChange}
                    placeholder="Código"
                    className="codigo-input"
                />
                <BotonEntrar texto="Entrar" onClick={handleEntrar} />
            </div>
        </div>
    )
}

export default Jugador;