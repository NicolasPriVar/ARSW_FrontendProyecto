import './App.css';
import BotonModo from './componentes/botonModo';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Jugador from './paginas/Jugador';
import Administrador from './paginas/Administrador';
import Lobby from './paginas/Lobby';
import Partida from './paginas/Partida';
import Fin from './paginas/Fin';
import LlamadaVoz from './componentes/LlamadaVoz';
import { useContext } from 'react';
import { CallContext } from './CallContext';

function Inicio() {
    const navigate = useNavigate();

    return (
        <div className="App">
            <div className="contenido">
                <h1>Bienvenido a Mente Maestra</h1>
                <h3>El juego de cultura general</h3>
                <div className="botones">
                    <BotonModo texto="Soy Administrador" color="#007BFF" onClick={() => navigate('/administrador')} />
                    <BotonModo texto="Soy Jugador" color="#28a745" onClick={() => navigate('/jugador')} />
                </div>
            </div>
        </div>
    );
}

function App() {
    const { enLlamada, nombre, codigo } = useContext(CallContext);

    return (
        <>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/administrador" element={<Administrador />} />
                <Route path="/jugador" element={<Jugador />} />
                <Route path="/lobby/:codigo" element={<Lobby />} />
                <Route path="/partida/:codigo" element={<Partida />} />
                <Route path="/fin" element={<Fin />} />
            </Routes>
            {enLlamada && nombre && codigo && <LlamadaVoz codigo={codigo} nombre={nombre} />}
        </>
    );
}

export default App;
