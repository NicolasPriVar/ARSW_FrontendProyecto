import React, { createContext, useState } from "react";

export const CallContext = createContext();

export const CallProvider = ({ children }) => {
    const [enLlamada, setEnLlamada] = useState(false);
    const [nombre, setNombre] = useState(null);
    const [codigo, setCodigo] = useState(null);

    return (
        <CallContext.Provider value={{ enLlamada, setEnLlamada, nombre, setNombre, codigo, setCodigo }}>
            {children}
        </CallContext.Provider>
    );
};
