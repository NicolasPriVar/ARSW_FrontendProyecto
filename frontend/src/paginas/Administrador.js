import React, {useState} from 'react';
import BotonGenerar from '../componentes/botonGenerar';
import BotonEntrar from '../componentes/botonEntrar';
import './Administrador.css';

function Administrador() {
    const [codigo, setCodigo] = useState('');

    const generarCodigo = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/codigo', {
                method: 'POST'
            });
            const data = await response.json();
            setCodigo(data.codigo);
        } catch (error) {
            console.error('Error generando código:', error);
            alert('Hubo un error generando el código');
        }
    };

    const handleEntrar = () => {
        if(!codigo) {
            alert('Primero debes generar un código');
        } else {
            alert(`Entrando con código generado: ${codigo}`);
        }
    };

    return (
        <div className="contenedor-administrador">
            <div className="administrador-panel">
                <h2>¡Hola, Administrador!</h2>

                <BotonGenerar texto="Generar código" onClick={generarCodigo} />
                {codigo && <p className="codigo-generado">Codigo generado: <strong>{codigo}</strong></p> }
                <div className="espacio" />
                <BotonEntrar texto="Entrar" onClick={handleEntrar} />
            </div>
        </div>
    );
}

export default Administrador;