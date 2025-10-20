export interface ServerToClientEvents {
    'connect': () => void;
    'disconnect': () => void;
    'message:receive': (message: string) => void;
    'status:update': (status: 'online' | 'offline') => void;
}

export interface ClientToServerEvents {
    'message:send': (message: string) => void;
    'user:status': (status: 'typing' | 'idle') => void;
}