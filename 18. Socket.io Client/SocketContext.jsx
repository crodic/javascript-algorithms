import { createContext, useContext, useEffect, useState } from 'react';

import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const socket = io('http://localhost:3001', {
            query: {
                token: 'Crodic Crystal', // jwt token
            },
        });
        setSocket(socket);

        return () => {
            socket.disconnect();
        };
    }, []);
    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
    return useContext(SocketContext);
};
