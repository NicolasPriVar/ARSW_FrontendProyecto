import React from 'react';

function JugadorActual({ nombre }) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <h3>Tu nombre: <strong>{nombre}</strong></h3>
        </div>
    );
}

export default JugadorActual;