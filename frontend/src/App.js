import './estilos/App.css'
import BotonModo from './componentes/botonModo';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './paginas/Jugador'
import './paginas/Administrador'
import { useNavigate } from 'react-router-dom';

function App() {

    const navigate = useNavigate();

  return (
    <div className="App">
      <div className="contenido">
          <h1>Bienvenido a Mente Maestra</h1>
          <h3>El juego de cultura general</h3>
          <div className="botones">
            <BotonModo texto="Soy Administrador" color="#007BFF"  onClick={() => navigate('/administrador')} />
            <BotonModo texto="Soy Jugador" color="#28a745"  onClick={() => navigate('/jugador')} />
          </div>
      </div>
    </div>
  );
}

export default App;
