import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './App';
import Administrador from "./paginas/Administrador";
import Jugador from "./paginas/Jugador";

function MainRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/administrador" element={<Administrador />} />
                <Route path="/jugador" element={<Jugador />} />
            </Routes>
        </BrowserRouter>
    );
}

export default MainRouter;
