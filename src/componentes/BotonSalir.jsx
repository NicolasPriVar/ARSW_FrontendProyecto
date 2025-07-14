import React from 'react';

function BotonSalir({ onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                marginTop: '20px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
            }}
        >
            Salir del juego
        </button>
    );
}

export default BotonSalir;
